export const calculateGradeAndGradePoints = (totalMarks: number) => {
  let result = {
    grade: "N/A",
    gradePoints: 0,
  };

  if (totalMarks >= 0 && totalMarks <= 19) {
    result = {
      grade: "F",
      gradePoints: 0,
    };
  } else if (totalMarks >= 20 && totalMarks <= 39) {
    result = {
      grade: "D",
      gradePoints: 1,
    };
  } else if (totalMarks >= 40 && totalMarks <= 59) {
    result = {
      grade: "C",
      gradePoints: 2,
    };
  } else if (totalMarks >= 60 && totalMarks <= 79) {
    result = {
      grade: "B",
      gradePoints: 3,
    };
  } else if (totalMarks >= 80 && totalMarks <= 100) {
    result = {
      grade: "A",
      gradePoints: 4,
    };
  }
  return result;
};
