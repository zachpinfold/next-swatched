import React, {
  createRef,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { connect } from "react-redux";
import useResizeAware from "react-resize-aware";
import { startAddSwatchToSwatchList } from "../../../actions/swatch";

interface WidthHeight {
  width: number;
  height: number;
}

interface MouseHover {
  pageX: number;
  pageY: number;
  target: { offsetLeft: number; offsetTop: number };
}

const ImageDropper = ({
  imagePreview,
  startAddSwatchToSwatchList,
}: {
  imagePreview: string;
  startAddSwatchToSwatchList: (rgb: number[]) => any;
}) => {
  // console.log(imagePreview);

  const initialSvgHeight = { height: 0, width: 0 };
  const width = 300;
  const height = 300;

  const divRef = createRef<any>();

  const [outerHeight, setOuterHeight] = useState<WidthHeight>(initialSvgHeight);
  const canvasRef = useRef(null);
  const { devicePixelRatio } = window;
  const [previewColour, setPreviewColour] = useState<null | number[]>(null);
  const [resizeListener, sizes] = useResizeAware();

  const SVG = ({
    imageSrc,
    ...props
  }: {
    imageSrc: string;
    width: number;
    height: number;
  }) => (
    <svg
      focusable={false}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      imageRendering="optimizeQuality"
      {...props}
    >
      <image x="0" y="0" width="100%" height="100%" xlinkHref={imageSrc} />
    </svg>
  );

  useEffect(() => {
    const { width, height } = sizes;

    if (width && height) {
      setOuterHeight({
        height,
        width,
      });
    }
  }, [sizes]);

  useEffect(() => {
    const canvas: any = canvasRef.current;
    let context: any;

    if (canvas != null) {
      context = canvas.getContext("2d");
    }
    const { width, height } = outerHeight;

    canvas.width = width;
    canvas.height = height;

    const fetchImage = async () => {
      const res = await fetch(imagePreview.dataURL);
      const blob: any = await res.blob();

      const blobSrc: any = await blob2base64(blob);

      console.log(blobSrc);

      await loadImage(blobSrc);

      const svg = <SVG imageSrc={blobSrc} width={width} height={height} />;
      const staticMarkup = renderToStaticMarkup(svg);
      const encodedSvgMarkup = encodeURIComponent(staticMarkup);
      const imageSrc = `data:image/svg+xml,${encodedSvgMarkup}`;
      const img = new Image();

      await loadImage(imageSrc, img);

      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    fetchImage();
  }, [outerHeight.width]);

  const loadImage = (src: string, img = new Image()) =>
    new Promise((resolve) => {
      img.addEventListener("load", resolve, false);

      img.src = src;
    });

  const blob2base64 = (blob: any) =>
    new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        event.target && resolve(event.target.result);
      };

      reader.readAsDataURL(blob);
    });

  const handleMouseMove = (e: any) => {
    const {
      pageX,
      pageY,
      target: { offsetLeft, offsetTop },
    }: MouseHover = e;

    const canvas: any = canvasRef.current;
    let context: any;

    if (canvasRef.current != null) {
      context = canvas.getContext("2d");
    }

    console.log(devicePixelRatio);

    const x = (pageX - offsetLeft) * 1;
    const y = (pageY - offsetTop) * 1;
    const { data } = context.getImageData(x, y, 1, 1);

    setPreviewColour(data.join(",").split(",").map(Number));
  };

  console.log(imagePreview.dataURL);

  const handleMouseDown = () => {
    if (previewColour) {
      previewColour;
      const poppedColour = previewColour.slice(0, -1);
      startAddSwatchToSwatchList(poppedColour);
    }
  };

  return (
    <Fragment>
      <div
        style={{
          backgroundColor: previewColour ? `rgba(${previewColour})` : "grey",
        }}
        className="colour_preview"
      >
        <h4>Press down to save colour</h4>
      </div>
      <canvas
        ref={canvasRef}
        style={{ cursor: "crosshair" }}
        width={width}
        height={height}
        // onMouseMove={(e) => handleMouseMove(e)}
        onMouseDown={(e) => handleMouseMove(e)}
        className="modal_canvas"
        // onMouseDown={handleMouseDown}
      />
      <div className="outer_image_dropper" ref={divRef}>
        {resizeListener}
        <img width="300" src={imagePreview.dataURL} ref={divRef} />
      </div>
    </Fragment>
  );
};

export default connect(null, { startAddSwatchToSwatchList })(ImageDropper);
