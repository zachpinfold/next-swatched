import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { startGetUserSwatches } from "../actions/swatch";
import HueSwatch from "../assets/images/HueSwatch";
import Tips from "../assets/images/Tips";
import SwatchSelector from "../components/swatch compare/SwatchCompare";
import ColorFilter from "../components/swatches/filters/ColorFilter";
import SwatchList from "../components/swatches/swatch list/SwatchList";
import Tutorial from "../components/swatches/tutorials/Tutorial";
import Dropdown from "../components/utils/Dropdown";
import { ColorNamesType, SwatchObject } from "../types/swatches";

interface Actions {
  startGetUserSwatches: (
    userUid: string,
    colorFilter: string,
    isInitialLoad: boolean
  ) => void;
  swatches: SwatchObject[];
}

const swatchPage = ({ startGetUserSwatches, swatches }: Actions) => {
  let refId = "dropdown_filter";

  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isTutorial, setIsTutorial] = useState<boolean>(false);
  const [compareArray, setCompareArray] = useState<number[][]>([]);
  const selectSwatchToCompareRef = useRef<boolean>(true);
  const [openState, setOpenState] = useState<boolean>(false);
  const [swatchNumber, setNumberOfSwatches] = useState<number>(2);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [swatchToCompare, setSwatchToCompare] = useState<number[]>([]);
  const [isClickedOutside, setIsClickedOutside] = useState<boolean>(false);
  const [isTutClickedOutside, setIsTutClickedOutside] =
    useState<boolean>(false);
  const [colorFilter, setColorFilter] = useState<ColorNamesType>({
    name: "all swatches",
    rgb: [197, 199, 196],
  });

  // console.log(isTutClickedOutside);

  useEffect(() => {
    startGetUserSwatches("", "all", true);
  }, [startGetUserSwatches]);

  useEffect(() => {
    const getCompareColours = async () => {
      try {
        const data = {
          model: "default",
          input: [swatchToCompare, "N", "N", "N", "N"],
        };

        const apiResponse = await axios.post("/api/colorMind", data);

        const { colourData } = apiResponse.data;

        colourData[0] = swatchToCompare;

        setCompareArray(colourData);
      } catch (error) {
        console.log(error);
      }
      selectSwatchToCompareRef.current = false;
    };

    if (
      selectSwatchToCompareRef.current === true &&
      swatchToCompare.length > 0
    ) {
      getCompareColours();
    }
  }, [swatchToCompare]);

  return (
    <div className="wrapper swatches_page">
      <div className="upper_area wrapper_inner">
        {/* <Dropdown
          Component={
            <ColorFilter
              isClickedOutside={isClickedOutside}
              setIsClickedOutside={setIsClickedOutside}
              colorFilter={colorFilter}
              setColorFilter={setColorFilter}
              setDropdownOpen={setDropdownOpen}
              isDropdownOpen={isDropdownOpen}
              refId={refId}
            />
          }
          setIsClickedOutside={setIsClickedOutside}
          refId={refId}
        /> */}
        <HueSwatch currentColour={colorFilter.name} />
        <div className="tips_wrap" id={refId}>
          <div
            onClick={() => {
              setIsTutorial(!isTutorial);
            }}
            // ref={isDropdownOpen ? wrapperRef : null}
            className="tips_button"
            id={refId}
          >
            <p id={refId}>tipsss</p>
            <Tips />
          </div>
          <Dropdown
            Component={<Tutorial isDropdownOpen={isTutorial} refId={refId} />}
            setIsClickedOutside={setIsTutClickedOutside}
            refId={refId}
          />
        </div>
      </div>

      <SwatchList
        swatches={swatches}
        setCompareArray={setCompareArray}
        selectSwatchToCompareRef={selectSwatchToCompareRef}
        setOpenState={setOpenState}
        setNumberOfSwatches={setNumberOfSwatches}
        openState={openState}
        setSwatchToCompare={setSwatchToCompare}
        swatchToCompare={swatchToCompare}
      />
      <div
        className="outer_selector "
        style={{
          zIndex: compareArray.length > 0 ? "1" : "-1",
          height: fullScreen ? "100%" : "35%",
        }}
      >
        <SwatchSelector
          compareArray={compareArray}
          setCompareArray={setCompareArray}
          setOpenState={setOpenState}
          openState={openState}
          setNumberOfSwatches={setNumberOfSwatches}
          swatchNumber={swatchNumber}
          setFullScreen={setFullScreen}
          fullScreen={fullScreen}
          swatchToCompare={swatchToCompare}
          setSwatchToCompare={setSwatchToCompare}
          selectSwatchToCompareRef={selectSwatchToCompareRef}
        />
      </div>
      <div
        style={{ opacity: compareArray.length === 0 && openState ? "1" : "0" }}
        className="loader home_loader"
      ></div>
    </div>
  );
};

interface StateProps {
  swatches: SwatchObject[];
}

const mapStateToProps = (state: any): StateProps => ({
  swatches: state.swatches.swatches,
});

export default connect(mapStateToProps, { startGetUserSwatches })(swatchPage);
