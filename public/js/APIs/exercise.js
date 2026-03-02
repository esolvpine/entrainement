/* FETCH */
let workoutUpdated = false;

// Fetch exercises and workouts in parallel for improved performance
const fetchExercises = async (callback) => {
  try {
    const user = localStorage.getItem("user");

    // Fetch both exercises and workouts in parallel
    const [exercisesRes, workoutsRes] = await Promise.all([
      fetch(`../exercises/?user=${encodeURIComponent(user)}`),
      fetch(`../workouts/?user=${encodeURIComponent(user)}`)
    ]);

    if (!exercisesRes.ok) {
      throw new Error(`Exercises fetch failed: ${exercisesRes.status}`);
    }
    if (!workoutsRes.ok) {
      throw new Error(`Workouts fetch failed: ${workoutsRes.status}`);
    }

    const [exercisesData, workoutsData] = await Promise.all([
      exercisesRes.json(),
      workoutsRes.json()
    ]);

    exercises = ArrayUtilities.sortByName(exercisesData.exercises);
    localStorage.setItem("exercises", JSON.stringify(exercises));

    workouts = ArrayUtilities.sortByName(workoutsData.workouts);
    workoutEnhance(workouts);
    localStorage.setItem("workouts", JSON.stringify(workouts));

    if (callback) callback();

    window.location.href = "/views/workoutList.html";
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Failed to load data. Please try again.");
  }
};

// /* UPDATING */
const exerciseUpdate = async (ex) => {
  try {
    prepareExerciseForProcessing();
    const response = await fetch("../exercises/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ex),
    });

    if (!response.ok) {
      throw new Error(`Exercise update failed: ${response.status}`);
    }

    const data = await response.json();
    updateExercisesArray();
    localStorage.setItem("currentExercise", JSON.stringify(ex));
    window.location.href = "exerciseList.html";
  } catch (error) {
    console.error("Error updating exercise:", error);
    alert("Failed to update exercise. Please try again.");
  }
};

const silentExerciseUpdate = async () => {
  try {
    exerciseClean();
    currentExercise.sets[currentSerieIndex].completed = true;
    currentExercise.sets[currentSerieIndex].lastUpdate = currentDay();

    const response = await fetch("../exercises/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentExercise),
    });

    if (!response.ok) {
      throw new Error(`Silent exercise update failed: ${response.status}`);
    }

    localStorage.setItem("currentExercise", JSON.stringify(currentExercise));
    updateExercisesArray();
    currentWorkout.lastUpdate = currentDay();
    if (!workoutUpdated) workoutExerciseUpdate(currentWorkout);
  } catch (error) {
    console.error("Error updating exercise:", error);
    alert("Failed to save progress. Please try again.");
  }
};
/* ADDING */
const exerciseAdd = async (ex) => {
  try {
    prepareExerciseForProcessing();
    const response = await fetch("../exercises/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ex),
    });

    if (!response.ok) {
      throw new Error(`Exercise add failed: ${response.status}`);
    }

    const data = await response.json();
    exercises.push(data.newExercise);
    localStorage.setItem("exercises", JSON.stringify(exercises));
    window.location.href = "exerciseList.html";
  } catch (error) {
    console.error("Error adding exercise:", error);
    alert("Failed to add exercise. Please try again.");
  }
};

// /* DELETING */
const exerciseDelete = async () => {
  try {
    const obj = currentExercise;
    const response = await fetch("../exercises/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ obj }),
    });

    if (!response.ok) {
      throw new Error(`Exercise delete failed: ${response.status}`);
    }

    localStorage.setItem("exerciseAction", "edit");
    $.each(exercises, (index, ex) => {
      if (ex._id === currentExercise._id) {
        exercises.splice(index, 1);
        return false;
      }
    });
    localStorage.setItem("exercises", JSON.stringify(exercises));
    deleteDeadExerciseFromWorkouts(obj._id);
    window.location.href = "exerciseList.html";
  } catch (error) {
    console.error("Error deleting exercise:", error);
    alert("Failed to delete exercise. Please try again.");
  }
};

const prepareExerciseForProcessing = () => {
  exerciseClean();
  currentExercise.lastUpdate = currentDay();
  currentExercise.user = localStorage.getItem("user");
  updateSets(currentExercise);
  currentExercise.restInterval = $("#select-restInterval").val();
  currentExercise.name = $("#input-name").val();
  currentExercise.movement = $("#select-movementSelect").val();
};

const updateSets = (ex) => {
  const newSet = [];
  let lastRecordedWeight = 0;
  const newSetsCount = $("#select-numSeries").val();
  for (let x = 0; x < newSetsCount; x++) {
    if (ex.sets[x]) {
      newSet.push({ weight: ex.sets[x].weight, reps: ex.sets[x].reps });
      lastRecordedWeight = ex.sets[x].weight;
    } else newSet.push({ weight: lastRecordedWeight, reps: 0 });
  }
  ex.sets = newSet;
};

const exerciseClean = () => {
  $.each(exercises, (index, ex) => {
    delete ex.type;
    delete ex.label;
    delete ex.update;
    delete ex.add;
    delete ex.delete;
    delete ex.index;
    ex.user = localStorage.getItem("user");
    $.each(ex.sets, (index, set) => {
      set.completed = false;
    });
  });
};
