import { Inter } from "next/font/google";
import { useState } from "react";


export default function Home() {
  const [imageDataUrl, setImageDataUrl] = useState();
  const [imageDetails, setImageDetails] = useState({
    name: "",
    type: "",
  })
  const requiredHeight =  400;
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    console.log("file", file)
    const imageName = file.name;
    const imageMime = file.type;
    setImageDetails({name: imageName, imageMime: imageMime});

    console.log("image", imageName, imageMime)
    const imageFile = new FileReader();
    let originalImage = new Image();

    imageFile.readAsDataURL(file);
    
    imageFile.onload = (event) => { //detect when file loads, then loads that file to our image element.
      originalImage.src = event.target.result;
      console.log('file loaded')
    };

    originalImage.onload = (() => { //detects when the image file loads, we can then start our ops on it.
      console.log("original dimension", originalImage.width, originalImage.height)
      let originalWidth = originalImage.width;
      let originalHeight = originalImage.height;

      const processingArea = document.getElementById('processingArea')
      let canvas = document.createElement("canvas");
      processingArea.appendChild(canvas);
      let canvasContext = canvas.getContext("2d");

      
      const targetHeight = requiredHeight;
      const targetWidth = Math.floor(targetHeight * (originalWidth/originalHeight))
      console.log("target dimensions", targetWidth, targetHeight)
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      canvasContext.drawImage(originalImage, 0, 0, canvas.width, canvas.height)

      //TODO : Figure out how to use this optimization and end up with the required target canvas size.
      // let curWidth = originalWidth, curHeight = originalHeight;

      // while(curHeight * 0.5 > targetHeight){
      //   let halfHeight = Math.floor(curHeight * 0.5)
      //   let halfWidth = Math.floor(curWidth * 0.5)

      //   // canvasContext.clearRect(0, 0, canvas.width, canvas.height);
         
      //   canvasContext.drawImage(canvas, 0, 0, halfWidth, halfHeight)

      //   curHeight = halfHeight;
      //   curWidth = halfWidth;
      // }
      // console.log("after iteration dimensions ",curWidth, curHeight)
      // canvasContext.drawImage(canvas, 0, 0, targetWidth, targetHeight) //final conversion
      
      const finalImageDataUrl= canvas.toDataURL('image/webp', 0.7);  //convert to webp and compressed to a 70% quality 
      console.log("a ", finalImageDataUrl)
      
      console.log("finalImageDataUrl ", finalImageDataUrl)
      setImageDataUrl(finalImageDataUrl)
    })
  };

  const handleDownloadClick = () => {
    if (imageDataUrl) {
      console.log('should download')
      const link = document.createElement('a');
      link.download = `${imageDetails.name.lastIndexOf(".")}.webp`; 
      link.href = imageDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <main
      className={'text-black flex-col flex'}
    >
       <h1>Upload an Image</h1>
        <input type="file" accept="image/*" onChange={handleFileInputChange} />
         
        <button type="button" className="w-32 border-2 border-black-500 bg-gray-200" onClick={handleDownloadClick}>download</button>
        <div id={"processingArea"}></div>
      
    </main>
  );
}
