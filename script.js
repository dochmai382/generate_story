document.addEventListener("DOMContentLoaded", async () => {
  const box = document.querySelector("#box");
  const form = document.querySelector("#controller");
  const submitButton = document.querySelector("#submitButton");
  const spinner = document.querySelector("#spinner");

  const url = "https://pitch-rigorous-visor.glitch.me";

  const add = (title, content) => {
    const div = document.createElement("div");
    const h2 = document.createElement("h2");
    h2.textContent = title;
    // div.appendChild(h2);
    const p = document.createElement("p");
    p.innerHTML = marked.parse(content);
    div.appendChild(p);
    box.appendChild(div);
  };

  // form 이벤트 리스너
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    box.innerHTML = "";

    const formData = new FormData(form);
    const [location, ruleCount] = [...formData.keys()].map((key) =>
      formData.get(key)
    );

    try {
      submitButton.disabled = true;
      spinner.classList.remove("d-none");
      form.appendChild(spinner);

      const data = await fetch(`${url}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location, ruleCount }),
      }).then((res) => res.json());

      data.forEach((item) => {
        add(item.title, item.content);
      });

      newForm();
    } catch (error) {
      console.error("Error:", error);
      alert("AI 호출 중 오류가 발생했습니다.");
    } finally {
      submitButton.disabled = false;
      spinner.classList.add("d-none");
    }
  };
  form.addEventListener("submit", handleFormSubmit);

  // 상황 설정해보기
  const ifMeForm = document.createElement("form");
  const newForm = () => {
    ifMeForm.id = "ifMeForm";
    const textarea = document.createElement("textarea");
    textarea.name = "ifMeText";
    textarea.placeholder = "탐사 상황 설정해세요";
    const ifMeButton = document.createElement("button");
    ifMeButton.id = "ifMeBtn";
    // ifMeButton.classList.add("submitButton"); // 기존 클래스는 그대로 두고 submitButton 클래스만 추가
    ifMeButton.textContent = "탐사하기";

    const span = document.createElement("span");
    span.id = "exploringMessage";
    span.textContent = "탐사 중...";
    span.classList.add("d-none");

    ifMeForm.appendChild(textarea);
    ifMeForm.appendChild(ifMeButton);
    ifMeForm.appendChild(span);

    box.appendChild(ifMeForm);
  };

  const handleIfMe = async (event) => {
    event.preventDefault();

    const ifMeButton = ifMeForm.querySelector("#ifMeBtn");
    const exploringMessage = document.querySelector("#exploringMessage");
    ifMeButton.disabled = true; // 버튼 비활성화.. 왜 안되지;;;;
    exploringMessage.classList.remove("d-none"); // "탐사 중" 메시지 표시

    const formData = new FormData(ifMeForm);
    const ifMeText = formData.get("ifMeText");

    const results = document.querySelector("#box").children;
    // console.log("results", results);
    const story = results[0].textContent;
    const manual = results[1].textContent;

    try {
      const data = await fetch(`${url}/generateIfMe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ story, manual, text: ifMeText }),
      }).then((res) => res.json());

      add(data.title, data.content); // add 함수 호출
    } catch (error) {
      console.error("Error:", error);
      alert("AI 호출 중 오류가 발생했습니다.");
    } finally {
      ifMeButton.disabled = false;
      exploringMessage.classList.add("d-none");
    }
  };
  ifMeForm.addEventListener("submit", handleIfMe);
}); // DOMContentLoaded
