import React, { useEffect, useState } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button, Grid, Container, Typography, Card, CardContent, CardMedia, OutlinedInput } from '@mui/material';
import { DateField } from '@mui/x-date-pickers/DateField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import { Dayjs } from 'dayjs';
import { getApiWithoutToken } from '../services/api';


interface NewsArticle {
    id: number;
    title: string;
    description: string;
    image_url: string;
    published_at: string;
}


const NewsSearch: React.FC = () => {
    const [keyword, setKeyword] = useState<string>('');
    const [fromDate, setFromDate] = React.useState<Dayjs | null>(null);
    const [toDate, setToDate] = React.useState<Dayjs | null>(null);
    const [sources, setSources] = useState<Source[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedSources, setSelectedSources] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [error, setError] = useState<string | null>(null);

    interface Source {
        id: number,
        name: string
    }

    interface Category {
        id: number,
        name: string
    }

    useEffect(() => {
        const fetchSources = async() => {
            const response = await getApiWithoutToken('http://localhost:8000/api/sources');
            const data: Source[] = await response;
            setSources(data);
        };

        const fetchCategories = async() => {
            const response = await getApiWithoutToken('http://localhost:8000/api/categories');
            const data: Category[] = await response;
            setCategories(data);
        };

        fetchSources();
        fetchCategories();
    }, []);

    const handleSearch = async () => {
        const queryParams = {
            keyword,
            from_date: fromDate ? fromDate.format('YYYY-MM-DD') : "",
            to_date: toDate ? toDate.format('YYYY-MM-DD'): "",
            source: selectedSources,
            category: selectedCategories,
        }
        try {
            const response = await getApiWithoutToken('http://localhost:8000/api/news/search', queryParams);
            setNews(response.data);
        } catch (err) {
            setError('Error fetching news');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Search News
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <TextField
                        label="Keyword"
                        fullWidth
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Sources</InputLabel>
                        <Select
                            input={<OutlinedInput label="Sources" />}
                            multiple
                            value={selectedSources}
                            onChange={(e) => setSelectedSources(e.target.value as string[])}
                            renderValue={(selected) => { 
                                const selectedSources = (selected).map(id => {
                                    const source = sources.find(source => source.id == +id);
                                    return source ? source.name : '';
                                });
                                return selectedSources.join(', ');
                            }}
                        >
                            {sources.map((source) => (
                                <MenuItem key={source.name} value={source.id}>
                                    {source.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Categories</InputLabel>
                        <Select
                            input={<OutlinedInput label="Categories" />}
                            multiple
                            value={selectedCategories}
                            onChange={(e) => setSelectedCategories(e.target.value as string[])}
                            renderValue={(selected) => { 
                                const selectedCategories = (selected).map(id => {
                                    const category = categories.find(category => category.id == +id);
                                    return category ? category.name : '';
                                });
                                return selectedCategories.join(', ');
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
                <Grid item xs={12} md={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateField 
                            label="From Date"
                            value={fromDate}
                            format="YYYY-MM-DD"
                            clearable
                            onChange={(newValue) => setFromDate(newValue)} 
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateField 
                            label="To Date"
                            value={toDate}
                            format="YYYY-MM-DD"
                            clearable
                            onChange={(newValue) => setToDate(newValue)} 
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Button variant="contained" color="primary" onClick={handleSearch}>
                        Search
                    </Button>
                </Grid>
            </Grid>

            {error && <Typography color="error">{error}</Typography>}

            <Grid container spacing={2} sx={{ mt: 4 }}>
                {news.length > 0 ? (
                    news.map((article) => (
                        <Grid item xs={12} sm={6} md={4} key={article.id}>
                            <Card>
                                {article.image_url && (
                                    <CardMedia
                                        component="img"
                                        alt={article.title}
                                        height="140"
                                        image={article.image_url}
                                    />
                                )}
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {article.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {article.description}
                                    </Typography>
                                    <hr />
                                    <Typography variant="body2" color="text.secondary">
                                        Published at: {format(new Date(article.published_at), 'MMM d, yyyy h:mm a')}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center" color="text.secondary">
                            No results found
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default NewsSearch;
