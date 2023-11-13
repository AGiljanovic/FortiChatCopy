import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Ad</Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src="http://localhost:3001/assets/skin.png"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography color={main}>GlowBoost Supplements</Typography>
        <Typography color={medium}>glowboost.com</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
      Unlock Your Pathway to Radiant Beauty: Glowing Skin 
      and Effortless Shine with GlowBoost Supplements!
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
