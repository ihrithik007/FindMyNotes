const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const { createClient } = require('@supabase/supabase-js');
const supabase = require("../config/supabase");

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const storage = multer.memoryStorage();
var upload = multer({ storage: storage });

const uploadNote = async (req, res) => {
    try {
        const fileName = req.body.title;
        const fileDescription = req.body.description || fileName;
        const tags = req.body.tags || '';
        const sessionToken = req.headers.authorization?.split(' ')[1];
        
        console.log("Upload request received:", { 
            fileName, 
            fileDescription, 
            tags, 
            hasFile: !!req.file,
            fileDetails: req.file ? {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            } : null
        });
        
        if (!sessionToken) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Create a new Supabase client with the user's session token
        const supabaseWithAuth = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${sessionToken}`
                    }
                }
            }
        );

        // Get the current user's ID
        const { data: { user }, error: userError } = await supabaseWithAuth.auth.getUser();
        
        if (userError || !user) {
            console.error("User authentication error:", userError);
            return res.status(401).json({ error: 'Failed to get user information' });
        }

        const uploadedBy = user.id;
        
        if (!req.file) {
            console.error("No file in request");
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Upload file to Supabase Storage
        const fileExt = path.extname(req.file.originalname);
        const fileNameWithExt = `${Date.now()}-${path.parse(req.file.originalname).name}${fileExt}`;
        const filePath = `${uploadedBy}/${fileNameWithExt}`;
        
        console.log("Attempting to upload file to Supabase:", {
            filePath,
            fileSize: req.file.size,
            fileType: req.file.mimetype
        });

        const { data: fileData, error: fileError } = await supabaseWithAuth.storage
            .from('notes')
            .upload(filePath, req.file.buffer, {
                contentType: req.file.mimetype,
                cacheControl: '3600',
                upsert: false
            });

        if (fileError) {
            console.error('File upload error:', fileError);
            return res.status(500).json({ 
                error: 'Failed to upload file to storage', 
                details: fileError.message,
                code: fileError.code
            });
        }

        console.log("File uploaded successfully:", fileData);

        // Get public URL for the uploaded file
        const { data: { publicUrl } } = supabaseWithAuth.storage
            .from('notes')
            .getPublicUrl(filePath);

        console.log("Generated public URL:", publicUrl);

        // Insert note data into Supabase
        const notePayload = {
            file_name: fileName,
            file_description: fileDescription,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            file_url: publicUrl,
            file_type: fileExt.slice(1).toUpperCase(),
            uploaded_by: uploadedBy
        };

        console.log("Inserting note data:", notePayload);

        const { data: noteData, error: noteError } = await supabaseWithAuth
            .from('notes')
            .insert([notePayload])
            .select();

        if (noteError) {
            console.error('Note creation error:', noteError);
            // Attempt to delete the uploaded file if note creation fails
            await supabaseWithAuth.storage
                .from('notes')
                .remove([filePath]);
            return res.status(500).json({ 
                error: 'Failed to create note record', 
                details: noteError.message,
                code: noteError.code
            });
        }

        console.log("Note created successfully:", noteData);

        res.status(200).json({ 
            status: "success", 
            data: noteData[0] 
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            error: 'Internal server error during upload', 
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

const getNote = async (req, res) => {
    try {
        const { 
            title, 
            tag, 
            dateRange,
            fileTypes,
            sortField,
            sortOrder 
        } = req.query;
        
        const sessionToken = req.headers.authorization?.split(' ')[1];
        
        console.log("Search request received:", { 
            title, 
            tag, 
            dateRange,
            fileTypes,
            sortField,
            sortOrder
        });
        
        // Create a new Supabase client with the user's session token
        const supabaseWithAuth = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${sessionToken}`
                    }
                }
            }
        );

        // Get the current user's ID
        const { data: { user }, error: userError } = await supabaseWithAuth.auth.getUser();
        
        if (userError || !user) {
            console.error("User authentication error:", userError);
            throw new Error('Failed to get user information');
        }

        let query = supabaseWithAuth
            .from('notes')
            .select('*')
            .eq('uploaded_by', user.id); // Only get notes for current user

        // Apply title search
        if (title) {
            query = query.ilike('file_name', `%${title}%`);
        }

        // Apply tag search - search in the tags array
        if (tag) {
            query = query.contains('tags', [tag.trim()]);
        }

        // Apply date range filter - only if both from and to dates are provided
        if (dateRange?.from && dateRange?.to) {
            const fromDate = new Date(dateRange.from);
            const toDate = new Date(dateRange.to);
            
            if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
                query = query.gte('created_at', fromDate.toISOString());
                query = query.lte('created_at', toDate.toISOString());
            }
        }

        // Apply file type filter
        if (fileTypes && fileTypes.length > 0) {
            query = query.in('file_type', fileTypes);
        }

        // Apply sorting
        if (sortField && sortField !== 'relevance') {
            // Only apply sorting if the field exists in the database
            const validSortFields = ['created_at', 'file_name', 'file_type'];
            if (validSortFields.includes(sortField)) {
                query = query.order(sortField, { ascending: sortOrder === 'asc' });
            } else {
                // Default to created_at if invalid sort field
                query = query.order('created_at', { ascending: false });
            }
        } else {
            // Default sort by created_at desc
            query = query.order('created_at', { ascending: false });
        }

        console.log("Executing search query...");
        const { data, error } = await query;

        if (error) {
            console.error("Search query error:", error);
            throw new Error(error.message);
        }

        // If sorting by relevance and we have a title search, sort results by title match
        let sortedData = data || [];
        if (sortField === 'relevance' && title) {
            sortedData.sort((a, b) => {
                const aTitle = a.file_name.toLowerCase();
                const bTitle = b.file_name.toLowerCase();
                const searchTerm = title.toLowerCase();
                
                // Exact matches first
                if (aTitle === searchTerm && bTitle !== searchTerm) return -1;
                if (bTitle === searchTerm && aTitle !== searchTerm) return 1;
                
                // Starts with matches next
                if (aTitle.startsWith(searchTerm) && !bTitle.startsWith(searchTerm)) return -1;
                if (bTitle.startsWith(searchTerm) && !aTitle.startsWith(searchTerm)) return 1;
                
                // Contains matches last
                if (aTitle.includes(searchTerm) && !bTitle.includes(searchTerm)) return -1;
                if (bTitle.includes(searchTerm) && !aTitle.includes(searchTerm)) return 1;
                
                return 0;
            });
            
            // Reverse if descending order
            if (sortOrder === 'desc') {
                sortedData.reverse();
            }
        }

        console.log(`Search completed. Found ${sortedData.length} results.`);
        res.json({ 
            success: true,
            data: sortedData
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

const getNoteByID = async (req, res) => {
    try {
        const userId = req.params.id;
        const sessionToken = req.headers.authorization?.split(' ')[1];
        console.log(userId);

        // Create a new Supabase client with the user's session token
        const supabaseWithAuth = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${sessionToken}`
                    }
                }
            }
        );

        const { data, error } = await supabaseWithAuth
            .from('notes')
            .select('*')
            .eq('uploaded_by', userId);

        if (error) {
            throw new Error(error.message);
        }

        res.send({ data: data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const deleteNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const sessionToken = req.headers.authorization?.split(' ')[1];
        
        console.log("Delete request received for note:", noteId);
        
        if (!sessionToken) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Create a new Supabase client with the user's session token
        const supabaseWithAuth = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${sessionToken}`
                    }
                }
            }
        );

        // Get the current user's ID
        const { data: { user }, error: userError } = await supabaseWithAuth.auth.getUser();
        
        if (userError || !user) {
            console.error("User authentication error:", userError);
            return res.status(401).json({ error: 'Failed to get user information' });
        }

        // First, get the note to verify ownership and get file path
        const { data: note, error: fetchError } = await supabaseWithAuth
            .from('notes')
            .select('*')
            .eq('id', noteId)
            .single();

        if (fetchError) {
            console.error("Error fetching note:", fetchError);
            return res.status(404).json({ error: 'Note not found' });
        }

        // Verify that the note belongs to the current user
        if (note.uploaded_by !== user.id) {
            return res.status(403).json({ error: 'Not authorized to delete this note' });
        }

        // Extract file path from the file_url
        const fileUrl = new URL(note.file_url);
        const filePath = fileUrl.pathname.split('/').slice(-2).join('/'); // Gets "userId/filename"

        // Delete the file from storage
        const { error: storageError } = await supabaseWithAuth.storage
            .from('notes')
            .remove([filePath]);

        if (storageError) {
            console.error("Error deleting file from storage:", storageError);
            // Continue with note deletion even if file deletion fails
        }

        // Delete the note from the database
        const { error: deleteError } = await supabaseWithAuth
            .from('notes')
            .delete()
            .eq('id', noteId);

        if (deleteError) {
            console.error("Error deleting note:", deleteError);
            return res.status(500).json({ error: 'Failed to delete note' });
        }

        console.log("Note deleted successfully:", noteId);
        res.json({ 
            success: true,
            message: 'Note deleted successfully'
        });

    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

module.exports = { uploadNote, getNote, getNoteByID, deleteNote };