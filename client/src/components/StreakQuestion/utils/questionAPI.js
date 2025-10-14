export const fetchTodayQuestion = async (level) => {
  const data = {
    easy: {
      title: "Find Maximum in Array",
      description: "Given an array, find the maximum element.",
      example: "Input: [1,3,5,2] → Output: 5",
      constraints: "1 ≤ n ≤ 10^4",
    },
    mid: {
      title: "Reverse a Linked List",
      description: "Given the head of a linked list, reverse it.",
      example: "Input: [1,2,3,4] → Output: [4,3,2,1]",
      constraints: "List size ≤ 10^4",
    },
  };
  return data[level] || data.easy;
};

export const submitAnswer = async (code, question) => {
  // mock test result
  return {
    passedAll: code.includes("return"),
    output: code.includes("return")
      ? "All test cases passed!"
      : "Some test cases failed.",
  };
};
