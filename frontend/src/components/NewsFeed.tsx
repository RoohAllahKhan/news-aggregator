import React, { useEffect, useState } from 'react';
import { getApi, getApiWithoutToken } from '../services/api';
import {
    Card, CardContent, CardMedia, Grid, Typography, Container
} from '@mui/material';
import { format } from 'date-fns';

interface NewsArticle {
    id: number;
    title: string;
    description: string;
    image_url: string;
    published_at: string;
}

const NewsFeed: React.FC = () => {
    const [news, setNews] = useState<NewsArticle[]>([]);

    useEffect(() => {
        const fetchNews = async () => {
            const token = localStorage.getItem('token');
            const response = token ? await getApi('http://localhost:8000/api/prefered-news') : await getApiWithoutToken('http://localhost:8000/api/news');
            const data: NewsArticle[] = await response;
            setNews(data);
        };

        fetchNews();
    }, []);

    if (!news.length) return <div>Loading...</div>;

    const mainNews = news[0];
    const latestNews = news.slice(1);

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Card>
                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <CardMedia
                                    component="img"
                                    height="250"
                                    image={mainNews.image_url}
                                    alt={mainNews.title}
                                    style={{ objectFit: 'cover' }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <CardContent>
                                    <Typography variant="h4" component="h1">
                                        {mainNews.title}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        {mainNews.description}
                                    </Typography>
                                    <hr></hr>
                                    <Typography variant="body2" color="text.secondary">
                                    Published at: {format(new Date(mainNews.published_at), 'MMM d, yyyy h:mm a')}
                                    </Typography>
                                </CardContent>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

                {latestNews.map((article) => (
                    <Grid item key={article.id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={article.image_url}
                                alt={article.title}
                                style={{ objectFit: 'cover' }}
                            />
                            <CardContent>
                                <Typography variant="h6" component="h2">
                                    {article.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {article.description}
                                </Typography>
                                <hr></hr>
                                <Typography variant="body2" color="text.secondary">
                                    Published at: {format(new Date(article.published_at), 'MMM d, yyyy h:mm a')}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default NewsFeed;
