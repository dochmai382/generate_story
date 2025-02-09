document.addEventListener("DOMContentLoaded", async () => {
  const add = (title, result) => {
    const box = document.querySelector("#box");
    const div = document.createElement("div");
    const h3 = document.createElement("h3");
    h3.textContent = title;
    div.appendChild(h3);
    const p = document.createElement("p");
    p.textContent = result;
    box.appendChild(div.appendChild(p));
  };

  const form = document.querySelector("#controller");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    // console.log(formData.get("place"), formData.get("amount"));
    const [place, amount] = [...formData.keys()].map((key) =>
      formData.get(key)
    );

    const GEMINI_API_KEY = localStorage.getItem("GEMINI_API_KEY");

    // callAI
    const callAI = async (
      prompt,
      modelName = "gemini-2.0-pro-exp-02-05",
      action = "generateContent",
      generationConfig = {}
    ) => {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:${action}?key=${GEMINI_API_KEY}`;
      console.log("처리시작", new Date(), "모델:", modelName);
      const response = await axios.post(
        url,
        { contents: [{ parts: [{ text: prompt }] }], generationConfig },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data.candidates[0].content.parts[0].text;
    }; //callAI

    // 괴담 생성
    const generateStory = async (input) => {
      const prompt = `너는 소설가야. ${input}에서 발생하는 나폴리탄 괴담을 만들거야. 진입조건, 디테일을 넣어서 100자 이내로 평문으로 작성해줘.`;
      return await callAI(prompt);
    }; // generateStory
    const story = await generateStory(place);
    add("괴담", story);

    // 괴담 매뉴얼 만들기
    const generateManual = async (story, amount) => {
      const prompt = `너는 소설가야. ${story}에서 탈출할 수 있는 안내문을 ${amount}개에 맞춰 주의사항 등을 넣어서 작성해줘. 리스트형태로. 그 중 중요한 단어들을 빨간색으로 표시해줘. 앞에 미사여구 없이`;
      return await callAI(prompt);
    }; // generateManual
    const manual = await generateManual(story, amount);
    add("안내문", manual);

    // 사례 만들기 - thinking
    const generateRecord = async (story, manual) => {
      const modelName = "gemini-2.0-flash-thinking-exp-01-21";
      const prompt = `너는 소설가야. ${manual}을 참고해서 ${story}에서 탈출한 성공과 실패 사례를 합쳐서 1-5개 정도 평문으로 작성해줘`;
      return await callAI(prompt, modelName);
    }; // generateRecord
    const recordList = await generateRecord(story, manual);
    add("탐사일지", recordList);
  }); // form event
}); // DOMContentLoaded

/**
 * 1. 장소를 가지고 괴담 생성
 * 2. 1의 안내문 생성 <- 수칙 개수
 * 3. 2의 안내문 이용해 성공/실패 사례 만들기 (탐사기록)
 */
