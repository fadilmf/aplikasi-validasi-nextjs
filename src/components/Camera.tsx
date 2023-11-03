import { useCallback, useRef } from "react";
import { MdCameraAlt } from "react-icons/md";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 500,
  height: 500,
  facingMode: "environment",
};

export default function Camera({
  onCapture,
}: {
  onCapture: (image: string) => void;
}) {
  const webcamRef = useRef<any>(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current!!.getScreenshot();
    onCapture(imageSrc);
  }, [webcamRef]);

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="relative">
          <Webcam
            audio={false}
            height={500}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={500}
            videoConstraints={videoConstraints}
          />
          <div className="absolute bottom-2 flex justify-center w-full">
            <button
              onClick={capture}
              className="flex gap-2 items-center p-2 rounded-full text-white bg-green-500"
            >
              <MdCameraAlt />
              Ambil Gambar
            </button>
          </div>
          {/* <button
            onClick={capture}
            className="absolute bottom-2 inset-x-0 mx-auto flex gap-2 p-2 rounded-full text-white items-center bg-green-500"
          >
            <MdCameraAlt />
            Ambil Gambar
          </button> */}
        </div>
      </div>
    </>
  );
}
