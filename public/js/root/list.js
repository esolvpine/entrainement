const printList = (arr, label) => {
  // Cache jQuery selectors
  const $listLiContainer = $(".list-li-container");
  const $listContainer = $(".list-container");
  const $listContainerTitle = $(".list-container-title");

  // Batch DOM updates
  $listLiContainer.html(listLiTemplate(arr)).attr("obj_type", label);
  $(".list-header").append(listContainerTemplate(label));
  $listContainer.css({ display: "block" }).show();
  $listContainerTitle.append(listFilter(label) + `<div id='list-filter-icon'>${filterIcon()}</div>`);

  listEvent();
};

const printSublist = (arr, type) => {
  $(".list-li-container").append(sublistLiTemplate(arr, type));
  listEvent();
};

const listFilter = (type) => {
  let options;
  switch (type) {
    case "Exercises":
      options = movements;
      options.unshift("All");
      break;
    case "Workouts":
      options = ["All", "Active", "Inactive"];
      break;
  }
  return buildfilterList(options);
};

const printActiveList = (options, title) => {
  $(".list-container").html("");
  $(".list-container").append(listContainerTemplate(title));
  $(".list-li-container").append(listActiveLiTemplate(options));
  listView();
};

const listChildren = (obj, type) => {
  setList(type);
  printList();
  listEvent(); //in eventHandler
  addLiAttr(obj, currentList.filter);
  $(".list-container-title").append(listFilter(type));
};

const setList = (type) => {
  currentList.type = type;
  // currentList.action =  displayModifPage;
  switch (type) {
    case "exercise":
      currentList.label = "Exercises";
      currentList.filter = "movement";
      currentList.options = exercises;
      currentList.add = () => {
        return newExercise();
      };
      break;
    case "workout":
      currentList.label = "Workouts";
      currentList.filter = "active";
      currentList.options = workouts;
      currentList.add = () => {
        return newWorkout();
      };
      break;
  }
};

const addLiAttr = (ObjArr, targetKey) => {
  $.each(ObjArr, (i, obj) => {
    const filterValue = targetKey === "Active"
      ? (obj[targetKey] === 1 ? "Active" : "Inactive")
      : obj[targetKey];
    $(`#li${obj._id}`).attr("filter", filterValue);
  });
};

const filterList = (value) => {
  // Cache selectors
  const $listItems = $(".list-container li");
  const objType = $(".list-li-container").attr("obj_type");

  $listItems.hide();

  switch (objType) {
    case "Exercises":
      if (value === "All") {
        $listItems.show();
      } else {
        $(`.list-container li[filter='${value}']`).show();
      }
      break;
    case "Workouts":
      if (value === "All") {
        $listItems.show();
      } else {
        const filterValue = value === "Active" ? '0' : '1';
        $(`.list-container li[filter='${filterValue}']`).show();
      }
      break;
  }

  $("#select-filter").hide();
  $("#list-filter-icon").show();
};

const backToList = () => {
  listChildren(current.object, displayModifPage);
};
