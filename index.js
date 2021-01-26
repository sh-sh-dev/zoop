const got = require('got'),
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    router = express.Router(),
    port = process.env.port || 8727;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use('/', router);

router.get('/', (req, res) => {
    res.send({ ok: true, message: 'READY' })
});

router.post('/fetch', (req, res) => {
    let username = req.body.username;
    if (!username) res.send({
        ok: false,
        message: 'EMPTY_USERNAME'
    });

    (async () => {
        try {
            const user = await got(`https://instagram.com/${username}/?__a=1`, { json: true });
            
            res.send({ ok: true, message: user.body.graphql.user.profile_pic_url_hd });
        } catch (e) {
            console.error('ERROR: ' + e);
            res.send({
                ok: false,
                message: 'NOT_FOUND'
            });
        }
    })();
});

app.listen(port);
