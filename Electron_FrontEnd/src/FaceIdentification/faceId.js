
const fs = require("fs");
let labeledFaceDescriptors = [];
let faceMatcher = {};
let image
let canvas
const container = document.createElement('div')

const imageUpload = document.getElementById('imageUpload')
function logConsole(msg){
    document.getElementById("status").innerHTML = msg;
    console.log(msg);
}

faceapi.env.monkeyPatch({
    Canvas: HTMLCanvasElement,
    Image: HTMLImageElement,
    ImageData: ImageData,
    Video: HTMLVideoElement,
    createCanvasElement: () => document.createElement('canvas'),
    createImageElement: () => document.createElement('img')
  });
  
function Init(){
    const directories = fs.readdirSync(__dirname+"/images/labeled_images/", {
        withFileTypes: true
     }).map(m=> m.name);
     return Promise.all(
      directories.map(label => {
        const descriptions = []
        let imageCount = fs.readdirSync(__dirname+`/images/labeled_images/${label}/`,{withFileTypes:true}).map(m=> m.name);//.map(f=>f.name);
        logConsole(`${label} has ${imageCount.length} images`)
        for (let i = 0; i < imageCount.length; i++) {
          logConsole(`image ${i} ${imageCount[i]}`)
          faceapi.fetchImage(__dirname+`\\images\\labeled_images\\${label}\\${imageCount[i]}`).then(img=>{
             faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor().then(detections=>{
               descriptions.push(detections.descriptor);
             })
          })
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      }))
}

Promise.all(
    [
    faceapi.nets.faceRecognitionNet.loadFromUri(__dirname+'/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri(__dirname+'/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri(__dirname+'/models')
]).then(x=>{
  logConsole("Loading Folders");
    Init().then(b=>{
      logConsole("Linking handlers");
        container.style.position = 'relative'
        document.body.append(container)
        labeledFaceDescriptors=b;
        faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
        imageUpload.addEventListener('change', async () => {
            if (image) image.remove()
            if (canvas) canvas.remove()
            image = await faceapi.bufferToImage(imageUpload.files[0])
            container.append(image)
            canvas = faceapi.createCanvasFromMedia(image)
            container.append(canvas)
            const displaySize = { width: image.width, height: image.height }
            faceapi.matchDimensions(canvas, displaySize)
            const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
            results.forEach((result, i) => {
              const box = resizedDetections[i].detection.box
              const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
              drawBox.draw(canvas)
            })
          })
          logConsole("DONE");
    })
});
