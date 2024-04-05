import m from "mithril";
import { style } from "typestyle";
import Button from "../components/Button";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { exchangeCodeForAccessToken } from "../utils/notionAuth";
import { createDatabaseItem } from "../utils/notionClient";

const containerClass = style({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  width: "100%",
  fontSize: 22,
  fontFamily: "monospace",
});

type TaskItemType = {
  name: string;
  startTime: Date;
  stopTime: Date;
  id: number | string;
};

interface StateInterface {
  startWatch: VoidFunction;
  stopWatch: VoidFunction;
  isRunning: boolean;
  startTime: Date | null;
  tasks: TaskItemType[];
  currentTaskName: string;
  timerInterval: number | null | any;
}

function getPassedTimeFromDateToNow(start: Date, stop: Date): string {
  const now = moment(stop);
  const startDate = moment(start);

  const duration = moment.duration(now.diff(startDate));

  const hours = Math.floor(duration.asHours());
  const minutes = Math.floor(duration.asMinutes()) % 60;
  const seconds = Math.floor(duration.asSeconds()) % 60;

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return formattedTime;
}

export const App = () => {
  let timer: string = "00:00:00";

  const databaseIdState = {
    databaseId: "",
  };

  const state: StateInterface = {
    startWatch: function () {
      state.isRunning = true;
      state.startTime = new Date();
      state.timerInterval = setInterval(updateTimer, 1000);
    },
    stopWatch: function () {
      if (!state.startTime || !state.timerInterval) return;
      clearInterval(state.timerInterval);
      const newTaskItem: TaskItemType = {
        id: uuidv4(),
        name: state.currentTaskName,
        startTime: state.startTime,
        stopTime: new Date(),
      };
      state.tasks.push(newTaskItem);

      createDatabaseItem({
        databaseId: localStorage.getItem("databaseID") || "",
        name: state.currentTaskName,
        duration: getPassedTimeFromDateToNow(
          state.startTime,
          newTaskItem.stopTime
        ),
      });

      state.isRunning = false;
      state.startTime = null;
      state.currentTaskName = "";
      state.timerInterval = null;
      timer = "00:00:00";
    },
    startTime: null,
    isRunning: false,
    tasks: [],
    currentTaskName: "",
    timerInterval: null,
  };

  function updateTimer() {
    if (state.startTime) {
      const passedTime = getPassedTimeFromDateToNow(
        state.startTime,
        new Date()
      );
      timer = passedTime;
      m.redraw();
    }
  }

  return {
    oninit: function () {
      const token = localStorage.getItem("token") || null;

      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      if (code !== null) {
        exchangeCodeForAccessToken(code);
      } else {
        if (token === null) {
          console.log("redirect");
          window.location.href =
            "https://api.notion.com/v1/oauth/authorize?client_id=695b8556-de84-4c9c-b004-bf84a98457f1&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fnotion-time-tracker.vercel.app";
        }
      }
    },
    view: function () {
      const databaseID = localStorage.getItem("databaseID") || null;

      if (databaseID === null) {
        return m(
          "div",
          {
            class: style({
              fontFamily: "monospace",
              display: "flex",
              gap: "1rem",
            }),
          },
          [
            m("input", {
              type: "text",
              value: databaseIdState.databaseId,
              placeholder: "Enter database ID",
              oninput: (e: Event) => {
                const target = e.target as HTMLInputElement;
                databaseIdState.databaseId = target.value;
              },
              class: style({
                background: "transparent",
                outline: "none",
                border: "1px solid black",
                padding: "8px 12px",
                flexGrow: 1,
                fontSize: 18,
                fontFamily: "monospace",
              }),
            }),
            m(Button, {
              label: "Save database ID",
              onclick: () => {
                localStorage.setItem("databaseID", databaseIdState.databaseId);
                m.redraw();
              },
            }),
          ]
        );
      }

      return m("div", [
        m("div", { class: containerClass }, [
          m("input", {
            type: "text",
            value: state.currentTaskName,
            placeholder: "What are you working on?",
            oninput: (e: Event) => {
              const target = e.target as HTMLInputElement;
              state.currentTaskName = target.value;
            },
            class: style({
              background: "transparent",
              outline: "none",
              border: "1px solid black",
              padding: "8px 12px",
              flexGrow: 1,
              fontSize: 18,
              fontFamily: "monospace",
            }),
          }),
          m("div", { class: style({}) }, timer),
          m(Button, {
            label: !state.isRunning ? "Start" : "Stop",
            onclick: () => {
              if (state.isRunning) {
                state.stopWatch();
              } else {
                state.startWatch();
              }
            },
            disabled: state.currentTaskName.length === 0 && state.isRunning,
          }),
        ]),
        m("h2", { class: style({ fontFamily: "monospace" }) }, "Tasks"),
        m("div", { class: style({ fontFamily: "monospace" }) }, [
          state.tasks.length === 0
            ? m("h3", "No task found")
            : m("ul", [
                state.tasks.map((task) =>
                  m("li", { key: task.id }, [
                    m(
                      "div",
                      {
                        class: style({
                          display: "flex",
                          gap: "1rem",
                          fontSize: 18,
                        }),
                      },
                      [
                        m("div", task.name),
                        m(
                          "div",
                          getPassedTimeFromDateToNow(
                            task.startTime,
                            task.stopTime
                          )
                        ),
                      ]
                    ),
                  ])
                ),
              ]),
        ]),
      ]);
    },
  };
};
