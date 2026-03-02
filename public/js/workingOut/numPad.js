let showNumPad = () => {
  $(".numPad").css({ display: "grid" });
  let info = `Serie: ${parseInt(currentSerieIndex) + 1} of ${parseInt(
    currentExercise.sets.length
  )}`;

  $(`.numPad__header`).html(info);

  let nextExerciseName = "";
  let nextExerciseWeight = "";
  let nextIndex;
  $.each(currentWorkout.exercises, (index, ex) => {
    if (currentExercise._id === ex) nextIndex = index + 1;
  });
  if (nextIndex !== undefined && currentWorkout.exercises[nextIndex]) {
    let nextEx = exercises.find((obj) => obj._id === currentWorkout.exercises[nextIndex]);
    if (nextEx) {
      nextExerciseName = nextEx.name;
      nextExerciseWeight = nextEx.sets && nextEx.sets[0] ? nextEx.sets[0].weight : "";
    }
  }
  $(".numPad__nextExercise__name").text(nextExerciseName ? "Next: " + nextExerciseName : "");
  $(".numPad__nextExercise__weight").text(nextExerciseWeight ? nextExerciseWeight + " Lbs" : "");
};

let closeNumPad = () => {
  $(".numPad").css({ display: "none" });
  defocusSelectedSerie();
};

let hideNumPad = () => {
  $(".numPad").css({ display: "none" });
};
