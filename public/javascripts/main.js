/* eslint-disable no-undef */
$(document).ready(() => {
  // jQuery function for loading DataTable
  $('#books').DataTable({
    // removes default table search
    searching: false,
    // sets selectable pagination increment
    lengthMenu: [5, 10, 25],
  });
});
