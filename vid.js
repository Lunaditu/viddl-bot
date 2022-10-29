const ytdl = require('youtube-dl-exec');
const fs = require('fs');

/**
 * @param {String} url The URL of the video
 * @param {Function} callback The callback function (to do whatever with the file)
 * @param {String} filename File name to save the video temporarily. (Optional) (Defaults to vid_<epoch>.mp4)
 */
function downloadVid(url, callback, filename = `vid_${Date.now()}`) {
    return new Promise((res, rej) => {

        ytdl(url, {
            'output': `videos/${filename}.mp4`,
            'format': 'mp4',
        }).then(() => {
            new Promise((resolve, reject) => {
                console.log("Trying...");

                console.log("Resolving...");
                //            resolve(`videos/${filename}.mp4`, `${filename}.mp4`);
                resolve(callback(`videos/${filename}.mp4`, `${filename}.mp4`));
            }).then((val) => {
                console.log(val);
                if (val) {
                    fs.unlinkSync(`videos/${filename}.mp4`);
                    console.log("Deleted file.");
                }
            }).finally(() => {
                console.log("Done with the task!");
            });
            res(null);
            //        console.log('finally');
        }).catch((reason) => {
            rej("Invalid URL.");
        });

    });
}
module.exports = { downloadVid };