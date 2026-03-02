/* FETCH */
const fetchWorkouts = async (callback) => {
  try {
    const user = localStorage.getItem("user");
    const response = await fetch(`../workouts/?user=${encodeURIComponent(user)}`);

    if (!response.ok) {
      throw new Error(`Workouts fetch failed: ${response.status}`);
    }

    const data = await response.json();
    workouts = ArrayUtilities.sortByName(data.workouts);
    workoutEnhance(workouts);
    localStorage.setItem("workouts", JSON.stringify(workouts));

    if (callback) callback();

    window.location.href = "/views/workoutList.html";
  } catch (error) {
    console.error("Error fetching workouts:", error);
    alert("Failed to load workouts. Please try again.");
  }
};

/* UPDATING */
const workoutExerciseUpdate = async (workout) => {
  try {
    prepareWorkoutForProcessing();
    const response = await fetch("/workouts/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workout),
    });

    if (!response.ok) {
      throw new Error(`Workout update failed: ${response.status}`);
    }
  } catch (error) {
    console.error("Error updating workout:", error);
  }
};

/* UPDATING */
const workoutUpdate = async () => {
  try {
    prepareWorkoutForProcessing();
    const obj = currentWorkout;
    const response = await fetch("/workouts/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    });

    if (!response.ok) {
      throw new Error(`Workout update failed: ${response.status}`);
    }

    updateWorkoutsArray();
    localStorage.setItem("workoutAction", "edit");
    window.location.href = "workoutList.html";
  } catch (error) {
    console.error("Error updating workout:", error);
    alert("Failed to update workout. Please try again.");
  }
};

/* ADDING */
const workoutAdd = async (wk) => {
  try {
    prepareWorkoutForProcessing();
    const response = await fetch("/workouts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wk),
    });

    if (!response.ok) {
      throw new Error(`Workout add failed: ${response.status}`);
    }

    const data = await response.json();
    workouts.push(data.newWorkout);
    localStorage.setItem("workouts", JSON.stringify(workouts));
    localStorage.setItem("workoutAction", "edit");
    window.location.href = "workoutList.html";
  } catch (error) {
    console.error("Error adding workout:", error);
    alert("Failed to add workout. Please try again.");
  }
};

const prepareWorkoutForProcessing = () => {
  currentWorkout.lastUpdate = currentDate();
  currentWorkout.user = localStorage.getItem("user");
  workoutClean();
  currentWorkout.name = $("#input-name").val();
};

/* DELETING */
const workoutDelete = async () => {
  try {
    const obj = currentWorkout;
    const response = await fetch("/workouts/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ obj }),
    });

    if (!response.ok) {
      throw new Error(`Workout delete failed: ${response.status}`);
    }

    localStorage.setItem("workoutAction", "edit");
    $.each(workouts, (index, wrk) => {
      if (wrk._id === currentWorkout._id) {
        workouts.splice(index, 1);
        return false;
      }
    });
    localStorage.setItem("workouts", JSON.stringify(workouts));
    window.location.href = "workoutList.html";
  } catch (error) {
    console.error("Error deleting workout:", error);
    alert("Failed to delete workout. Please try again.");
  }
};

const workoutClean = () => {
  $.each(workouts, (index, wk) => {
    delete wk.type;
    delete wk.label;
    delete wk.update;
    delete wk.add;
    delete wk.delete;
    delete wk.temp;
  });
};
