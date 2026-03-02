let listType = "";
const listContainerTemplate = (type) => {
  listType = type;
  const title = type === "Workouts"
    ? (workoutAction === "workingOut" ? "WorkingOut" : "WorkoutsEdit")
    : "ExerciseEdit";

  return `<div class='list-container-title' ><div class='list-title'>${fetchTranslation(
    title
  )}</div></div>`;
};

const listLiTemplate = (objArray) => {
  return objArray.map((obj, index) => {
    const filterValue = listType === "Workouts" ? obj.active : obj.movement;
    const formattedDate = formatDate(obj.lastUpdate);
    return `<li id='li${obj._id}' obj_id='${obj._id}' obj_index='${index}' filter='${filterValue}'><div>${obj.name}</div><div class='li-date'>(${formattedDate})</div></li>`;
  }).join('');
};

const buildfilterList = (options) => {
  const optionsHtml = options.map(op =>
    `<li onclick="filterList('${op}')" value='${op}'>${op}</li>`
  ).join('');
  return `<div id='select-filter'><ul>${optionsHtml}</ul></div>`;
};

const sublistContainerTemplate = (type) => {
  return `<div class='list-container-title' ><div class='list-title'>${fetchTranslation(
    type
  )}</div></div><div class='list-li-container'></div>`;
};

const sublistLiTemplate = (objArray, type) => {
  return objArray.map((obj, index) => {
    let html = `<li id='li${obj._id}' obj_id='${obj._id}' obj_index='${index}' obj_type='${type}'>`;
    html += `<div class='exercise-name'>${obj.name}</div>`;

    // Add sets details if this is an exercise with sets
    if (type === 'exercise' && obj.sets && obj.sets.length > 0) {
      html += `<div class='exercise-sets'>`;
      obj.sets.forEach((set, setIndex) => {
        html += `<div class='set-detail'>Set ${setIndex + 1}: ${set.weight} lbs x ${set.reps} reps</div>`;
      });
      html += `</div>`;
    }

    html += `</li>`;
    return html;
  }).join('');
};
