import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Select, MenuItem, FormControl, InputLabel, Button, OutlinedInput, SnackbarCloseReason, Snackbar, Alert, CircularProgress } from '@mui/material';
import { getApiWithoutToken } from '../services/api';
import { getApi, putApi } from '../services/api';

interface Source {
    id: number,
    name: string
}

interface Category {
    id: number,
    name: string
}

interface Author {
    id: number,
    name: string
}

const Preferences: React.FC = () => {
    const [sources, setSources] = useState<Source[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [selectedSources, setSelectedSources] = useState<string[]>([]);
    const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        // Fetch all available sources, authors, and categories
        const fetchOptionsAndPreferences = async () => {
            try {
                const [authorsResponse, sourcesResponse, categoriesResponse] = await Promise.all([
                    getApi('http://localhost:8000/api/authors'),
                    getApiWithoutToken('http://localhost:8000/api/sources'),
                    getApiWithoutToken('http://localhost:8000/api/categories')
                ]) ;
            
                setSources(sourcesResponse);
                setAuthors(authorsResponse);
                setCategories(categoriesResponse);

                const response = await getApi("http://localhost:8000/api/user-preference");
                
                if (response) {
                    setSelectedSources(response.sources.map((source: Source) => source.id));
                    setSelectedAuthors(response.authors.map((author: Author) => author.id));
                    setSelectedCategories(response.categories.map((category: Category) => category.id));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setSnackbarMessage('Error loading data.');
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        }
        

        fetchOptionsAndPreferences();
    }, []);

    const handleSave = async () => {
        const payload = {
            sources: selectedSources,
            authors: selectedAuthors,
            categories: selectedCategories,
        };

        try {
            const response = await putApi('http://localhost:8000/api/user-preference', payload);
            if (response) {
                setSelectedSources(response.sources.map((source: Source) => source.id));
                setSelectedAuthors(response.authors.map((author: Author) => author.id));
                setSelectedCategories(response.categories.map((category: Category) => category.id));
            }
            setSnackbarMessage('Preferences saved successfully!');
        } catch (error) {
            setSnackbarMessage('Error saving preferences.');
        } finally {
            setSnackbarOpen(true);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Grid container justifyContent="center">
                    <CircularProgress />
                </Grid>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                News Preference
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Sources</InputLabel>
                        <Select
                            input={<OutlinedInput label="Sources" />}
                            multiple
                            value={selectedSources}
                            onChange={(e) => setSelectedSources(e.target.value as string[])}
                            renderValue={(selected) => {
                                const selectedNames = selected.map(id => {
                                    const source = sources.find(source => source.id == +id);
                                    return source ? source.name : '';
                                });
                                return selectedNames.join(', ');
                            }}
                        >
                            {sources.map((source) => (
                                <MenuItem key={source.id} value={source.id}>
                                    {source.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Authors</InputLabel>
                        <Select
                            input={<OutlinedInput label="Authors" />}
                            multiple
                            value={selectedAuthors}
                            onChange={(e) => setSelectedAuthors(e.target.value as string[])}
                            renderValue={(selected) => {
                                const selectedNames = selected.map(id => {
                                    const author = authors.find(author => author.id === +id);
                                    return author ? author.name : '';
                                });
                                return selectedNames.join(', ');
                            }}
                        >
                            {authors.map((author) => (
                                <MenuItem key={author.id} value={author.id}>
                                    {author.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Categories</InputLabel>
                        <Select
                            input={<OutlinedInput label="Categories" />}
                            multiple
                            value={selectedCategories}
                            onChange={(e) => setSelectedCategories(e.target.value as string[])}
                            renderValue={(selected) => {
                                const selectedNames = selected.map(id => {
                                    const category = categories.find(category => category.id === +id);
                                    return category ? category.name : '';
                                });
                                return selectedNames.join(', ');
                            }}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Grid>
            </Grid>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Preferences;
