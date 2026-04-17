import { StyleSheet } from "react-native";

export const colors = StyleSheet.create({
  backgroundHomeLinearFrom: "#004689",
  backgroundHomeLinearTo: "#002863",
  backgroundOtherLinearFrom: "#3F3F47",
  backgroundOtherLinearTo: "#070709",
  card: {
    backgroundColor: "#151A31",
    borderColor: "#363A4E",
  },
  textTitle: {
    color: "#FFFFFF",
  },
  textSubtitle: {
    color: "#B4C0FF",
  },
  text: {
    color: "#FFFFFF",
  },
});

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
});