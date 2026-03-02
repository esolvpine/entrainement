let workoutAction = localStorage.getItem("workoutAction");
let exercises = JSON.parse(localStorage.getItem("exercises"));
let workouts = JSON.parse(localStorage.getItem("workouts"));
let currentWorkout;
jQuery(function () {
  //localStorage.setItem("workoutAction", "workingOut");
  loadHamburger();
  loadWorkoutList();
});

const loadWorkoutList = () => {
  workouts = ArrayUtilities.sortByPropName(workouts, "lastUpdate");
  printList(workouts, "Workouts");
};

const loadExercises = () => {
  if (currentWorkout.exercises.length === 0) {
    $(".list-li-container").append("No exercises");
  } else {
    $.each($("li"), (ind, el) => {
      $(el).hide();
    });
    $("#li" + currentWorkout._id).show();
    const parent = $("#li" + currentWorkout._id).parent();

    // Create Map for O(1) lookups instead of O(n) for each exercise
    const exercisesMap = new Map(exercises.map(ex => [ex._id, ex]));

    const exArr = [];
    const validExerciseIds = [];

    currentWorkout.exercises.forEach((exID) => {
      const ex = exercisesMap.get(exID);
      if (ex) {
        exArr.push(ex);
        validExerciseIds.push(exID);
      }
    });

    // Update workout with only valid exercise IDs
    currentWorkout.exercises = validExerciseIds;

    printSublist(exArr, "exercise");
  }
};
