const router = require('express').Router();
const axios = require('axios');

router.get('/searchAll/:keyword/:startindex', (req, res) => {
    axios.get("https://www.googleapis.com/books/v1/volumes", { params: { q: req.params.keyword, maxResults: 40, startIndex: parseInt(req.params.startindex) } }).then(({ data }) => {
        // console.log(data);
        res.status(200).send({ data: data.items, total: data.totalItems });
    }).catch(err => res.status(err?.response?.status || 500).send('Error'));

});

router.get('/getDetail/:id', (req, res) => {
    axios.get(`https://www.googleapis.com/books/v1/volumes/${req.params.id}`).then(({ data }) => {
        // console.log(data);
        res.status(200).send(data);
    }).catch(err => res.status(err?.response?.status).send('Error'));
});

router.get('/getMyBooks', (req, res) => {
    axios.get(`https://www.googleapis.com/books/v1/mylibrary/bookshelves?access_token=${req.query.token}`)
        .then(({ data }) => {
            // console.log(data);
            res.status(200).send(data.items);
        })
        .catch(err => res.status(err?.response?.status || 500).send('Error'));
});


router.get('/getOneBookshelf/:id', (req, res) => {
    axios.get(`https://www.googleapis.com/books/v1/mylibrary/bookshelves/${req.params.id}/volumes?access_token=${req.query.token}`)
        .then(({ data }) => {
            // console.log(data);
            res.status(200).send(data.items);
        })
        .catch(err => res.status(err?.response?.status || 500).send('Error'));
});



router.post('/addBook/:shelf/:volume', (req, res) => {
    axios.post(`https://www.googleapis.com/books/v1/mylibrary/bookshelves/${req.params.shelf}/addVolume?access_token=${req.query.token}`, null, { params: { volumeId: req.params.volume } }).then(({ data }) => {
        // console.log(data);
        res.status(200).send(data);
    }).catch(err => res.status(err?.response?.status || 500).send('Error'));

});



router.post('/moveBook/:from/:to/:volume', (req, res) => {
    axios.post(`https://www.googleapis.com/books/v1/mylibrary/bookshelves/${req.params.to}/addVolume?access_token=${req.query.token}`, null, { params: { volumeId: req.params.volume } }).then(({ data }) => {
        // console.log(data);
        res.status(200).send(data);
        axios.post(`https://www.googleapis.com/books/v1/mylibrary/bookshelves/${req.params.from}/removeVolume?access_token=${req.query.token}`, null, { params: { volumeId: req.params.volume } }).then(({ data }) => {
            // console.log(data);
            res.status(200).send(data);
        }).catch(err => {
            console.log(err)
            res.status(err?.response?.status).send('Error')
        })
    }).catch(err => {
        console.log(err)
        res.status(err?.response?.status).send('Error')
    })
});


router.post('/removeBook/:shelf/:volume', (req, res) => {
    axios.post(`https://www.googleapis.com/books/v1/mylibrary/bookshelves/${req.params.shelf}/removeVolume?access_token=${req.query.token}`, null, { params: { volumeId: req.params.volume } })
        .then(({ data }) => {
            // console.log(data);
            res.status(200).send(data);
        })
        .catch(err => res.status(err?.response?.status || 500).send('Error'));
});

router.post('/clearShelf/:shelf', (req, res) => {
    axios.post(`https://www.googleapis.com/books/v1/mylibrary/bookshelves/${req.params.shelf}/clearVolumes?access_token=${req.query.token}`)
        .then(({ data }) => {
            // console.log(data);
            res.status(200).send(data);
        })
        .catch(err => res.status(err?.response?.status || 500).send('Error'));
});



module.exports = router;