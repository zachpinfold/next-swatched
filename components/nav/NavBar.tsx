import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import Menu from "../../assets/images/Menu";
import { SwatchObject } from "../../types/swatches";
import Dropdown from "../utils/Dropdown";
import MenuDropdown from "./MenuDropdown";
import Link from "next/link";

interface Actions {
  initialSwatches: SwatchObject[];
  compact: boolean;
}

const NavBar = ({ initialSwatches, compact }: Actions) => {
  const wrapperRef = useRef<HTMLHeadingElement>(null);
  const [hover, setHover] = useState<boolean>(false);
  const [isClickedOutside, setIsClickedOutside] = useState<boolean>(false);
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isClickedOutside) {
      setDropdownOpen(false);
      setIsClickedOutside(false);
    }
  }, [isClickedOutside]);

  return (
    <nav style={{ height: compact ? "60px" : "100px" }} className="wrapper">
      <div className="wrapper_inner inner_nav">
        <div className="left_area">
          <Link href="/">
            <h1 style={{ fontSize: compact ? "30px" : "40px" }}>Swatched</h1>
          </Link>
          {!compact && (
            <p>
              Use <strong> deep learning</strong> to find and save colours to
              your swatch, powered by the <span>ColormindAPI</span>{" "}
            </p>
          )}
        </div>

        {initialSwatches.length > 0 && (
          <div
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            onMouseEnter={() => {
              setHover(true);
            }}
            onMouseLeave={() => {
              setHover(false);
            }}
            ref={wrapperRef}
            className="menu_wrapper"
          >
            <Menu initialSwatches={initialSwatches} hover={hover} />
          </div>
        )}
        <Dropdown
          Component={<MenuDropdown isDropdownOpen={isDropdownOpen} />}
          setIsClickedOutside={setIsClickedOutside}
          wrapperRef={wrapperRef}
        />
      </div>
    </nav>
  );
};

interface StateProps {
  initialSwatches: SwatchObject[];
}

const mapStateToProps = (state: any): StateProps => ({
  initialSwatches: state.swatches.initialSwatches,
});

export default connect(mapStateToProps, {})(NavBar);
