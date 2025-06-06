// google cloud storage
// local file storage
import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const storage = new Storage();

const rawVideoBucketName = "growingwd-yt-raw-videos";
const processedVideoBucketName = "growingwd-yt-processed-videos";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";


//creates the local directories for the raw and unprocessed files
export function setupDirectories(){
    ensureDirectory(localRawVideoPath);
    ensureDirectory(localProcessedVideoPath);
}


/**
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}.
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}.
 * @returns A promise that resolves when the video has been converted.
 */
export function convertVideo(rawVideoName: string, processedVideoName: string){
  return new Promise<void>((resolve,reject) => {
    ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
    .outputOptions('-vf', 'scale=0:360') // 360p
    .on('end', function() {
            console.log('Processing finished successfully');
            resolve();
        })
        .on('error', function(err: any) {
            console.log('An error occurred: ' + err.message);
            reject(err);
        })
        .save(`${localProcessedVideoPath}/${processedVideoName}`);
  })
}


/**
 * @param fileName - The name of the file to download from the 
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been downloaded.
 */
export async function downloadRawVideo(fileName: string) {
    await storage.bucket(rawVideoBucketName)
      .file(fileName)
      .download({destination: `${localRawVideoPath}/${fileName}`});

    console.log(
      `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`
    );
}


/**
 * @param fileName - The name of the file to upload from the 
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}.
 * @returns A promise that resolves when the file has been uploaded.
 */
export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);

    bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
        destination: fileName
    });

    console.log(
        `${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}.`
    );

    await bucket.file(fileName).makePublic();
}


export function deleteRawVideo(fileName: string){
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}

export function deleteProcessedVideo(fileName:string){
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

/**
 * @param fileName - The name of the file to delete from the
 * {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 * 
 */
function deleteFile(filePath: string): Promise<void>{
    return new Promise((resolve, reject) => {
        if(fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if(err){
                    console.log(`Failed to delete at ${filePath}`, err);
                    reject(err);
                }else{
                    console.log(`File not found at ${filePath}`);
                    resolve();
                    
                }
            })
           // reject(`File ${filePath} does not exist.`);
        }
        else{
            console.log(`File not found at ${filePath}, skipping the delete`);
            resolve();
        }
    });
}

//check if folder exists(directory) 
function ensureDirectory(dirPath: string){
    if(!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath, {recursive:true}); //recursive: true , is gonna enable created nested directory
        console.log(`Directory created at${dirPath}`);
    }

}

