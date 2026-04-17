import { StyleSheet } from "react-native";

export const colors = {
  backgroundHomeLinearFrom: "#004689",
  backgroundHomeLinearTo: "#002863",
  backgroundOtherLinearFrom: "#3F3F47",
  backgroundOtherLinearTo: "#070709",
  card: {
    backgroundColor: "#151A31",
    borderColor: "#363A4E",
  },
  textTitle: "#FFFFFF",
  textSubtitle: "#B4C0FF",
  text: "#FFFFFF",
  glassTab: {
    mainPillBorder: "rgba(255,255,255,0.30)",
    mainPillBackground: "rgba(85, 90, 108, 0.44)",
    shadow: "#030611",
    shine: "rgba(255,255,255,0.08)",
    activeBackground: "rgba(234, 236, 242, 0.34)",
    activeBorder: "rgba(255,255,255,0.40)",
    label: "rgba(247, 248, 252, 0.76)",
    labelActive: "#f7f8fc",
    iconActive: "#f7f8fc",
    iconInactive: "rgba(247, 248, 252, 0.76)",
  },
};

export const text = StyleSheet.create({
  title: {
    fontFamily: "SFProDisplay-Bold",
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontFamily: "SFProDisplay-Regular",
    fontSize: 18,
    fontWeight: "400",
  },
  text: {
    fontFamily: "SFProDisplay-Regular",
    fontSize: 12,
    fontWeight: "400",
  },
});

export const elements = StyleSheet.create({
  card: {
    backgroundColor: colors.card.backgroundColor,
    borderColor: colors.card.borderColor,
    borderRadius: 10,
  },
  title: {
    color: colors.textTitle,
    ...text.title,
  },
  subtitle: {
    color: colors.textSubtitle,
    ...text.subtitle,
  },
  text: {
    color: colors.text,
    ...text.text,
  },
  glassTabMainPill: {
    flex: 1,
    position: "relative",
    flexDirection: "row",
    borderRadius: 30,
    borderWidth: 1,
    overflow: "hidden",
    padding: 5,
    borderColor: colors.glassTab.mainPillBorder,
    backgroundColor: colors.glassTab.mainPillBackground,
    shadowColor: colors.glassTab.shadow,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.42,
    shadowRadius: 22,
    elevation: 14,
  },
  glassTabShine: {
    position: "absolute",
    top: 0,
    left: 10,
    right: 10,
    height: "52%",
    backgroundColor: colors.glassTab.shine,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  glassTabItem: {
    flex: 1,
    borderRadius: 24,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  glassTabActive: {
    borderWidth: 1,
    backgroundColor: colors.glassTab.activeBackground,
    borderColor: colors.glassTab.activeBorder,
  },
  glassTabLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.glassTab.label,
  },
  glassTabLabelActive: {
    fontWeight: "600",
    color: colors.glassTab.labelActive,
  },
  glassTabSideAction: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderColor: colors.glassTab.mainPillBorder,
    backgroundColor: colors.glassTab.mainPillBackground,
    shadowColor: colors.glassTab.shadow,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.42,
    shadowRadius: 22,
    elevation: 14,
  },
  glassTabSideActionShine: {
    position: "absolute",
    top: 0,
    left: 8,
    right: 8,
    height: "52%",
    backgroundColor: colors.glassTab.shine,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  glassTabIconActive: {
    color: colors.glassTab.iconActive,
  },
  glassTabIconInactive: {
    color: colors.glassTab.iconInactive,
  },
  glassTabWrapper: {
    left: 16,
    right: 16,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
