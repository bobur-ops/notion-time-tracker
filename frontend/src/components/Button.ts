import m, { Vnode } from "mithril";
import { style } from "typestyle";

const buttonStyle = style({
  background: "transparent",
  outline: "none",
  border: "1px solid black",
  padding: "8px 12px",
  fontSize: 18,
  cursor: "pointer",
  $nest: {
    "&:active": {
      transform: "scale(0.97)",
    },
  },
});

interface ButtonAttrs {
  onclick: () => void;
  label: string;
  disabled?: boolean;
}

const Button: m.Component<ButtonAttrs> = {
  view: (vnode: Vnode<ButtonAttrs>) => {
    const { label, disabled, onclick } = vnode.attrs;

    return m(
      "button",
      {
        onclick,
        disabled,
        class: buttonStyle,
        tabindex: disabled ? -1 : 0,
        "aria-label": label,
        "aria-disabled": disabled ? "true" : "false",
      },
      label
    );
  },
};

export default Button;
