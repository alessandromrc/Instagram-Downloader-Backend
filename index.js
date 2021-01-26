const Instagram = require('instagram-downloader');
const express = require('express')
const app = express()
var cors = require('cors');

var regex = new RegExp(/(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am)\/([A-Za-z0-9-_]+)/im);
app.use(cors({ origin: "*" }));

app.get('/', function(req, res) {
    try {
        if (req.query.link.match(regex)) {
            Instagram(req.query.link)
                .then(data => {
                    const { entry_data: { PostPage } } = data;
                    return PostPage.map(post => post.graphql.shortcode_media)
                })
                .then(images => {
                    if (images[0].is_video == true) {
                        res.json({
                            id: images[0].owner.id,
                            username: images[0].owner.username,
                            full_name: images[0].owner.full_name,
                            is_verified: images[0].owner.is_verified,
                            profile_pic: images[0].owner.profile_pic_url,
                            video_url: images[0].video_url,
                        })
                    } else {
                        res.json({
                            id: images[0].owner.id,
                            username: images[0].owner.username,
                            full_name: images[0].owner.full_name,
                            is_verified: images[0].owner.is_verified,
                            profile_pic: images[0].owner.profile_pic_url,
                            images: images[0].display_resources,
                        })
                    }
                })
        } else {
            res.send("Huh, this isn't an instagram link!");
        }
    } catch (err) {
        console.log(err);
    }
})

app.listen(162)