$(document).ready(() => {
  console.log('running');
  $('#books').DataTable({
    searching: false,
    lengthMenu: [
      [5, 10, 25, -1],
      [5, 10, 25, 'All'],
    ],
  });
});
