function getAllData() {
  fetch('server/getData.php')
    .then(response => response.json())
    .then(data => {
      // отображение полученных данных в таблице
    })
    .catch(error => console.error(error));
}

function addNewData() {
  const manufacturer = document.getElementById('manufacturer').value;
  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const quantity = document.getElementById('quantity').value;
  const data = new FormData();
  data.append('manufacturer', manufacturer);
  data.append('name', name);
  data.append('price', price);
  data.append('quantity', quantity);
  fetch('server/addData.php', {method: 'POST', body: data})
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        getAllData();
      }
    })
    .catch(error => console.error(error));
}

function sortTable(column) {
  let rows = Array.from(document.querySelectorAll('#table tbody tr'));
  rows.sort((row1, row2) => {
    let value1 = row1.querySelector(`td[data-column="${column}"]`).textContent;
    let value2 = row2.querySelector(`td[data-column="${column}"]`).textContent;
    return naturalCompare(value1, value2);
  });
  if (column === 'price' || column === 'quantity') {
    let total = rows.reduce((acc, row) => {
      let value = parseInt(row.querySelector(`td[data-column="${column}"]`).textContent);
      return acc + value;
    }, 0);
    let totalRow = document.querySelector('#table tfoot tr');
    totalRow.querySelector(`td[data-column="${column}"]`).textContent = total;
  }
  let tbody = document.querySelector('#table tbody');
  rows.forEach(row => tbody.appendChild(row));
}

function showTooltip(event) {
  let row = event.target.closest('tr');
  let tooltip = document.createElement('div');
  tooltip.classList.add('tooltip');
  tooltip.textContent = `${row.cells[0].textContent} ${row.cells[1].textContent} - ${row.cells[2].textContent} руб. (${row.cells[3].textContent} шт.)`;
  document.body.appendChild(tooltip);
  let coords = row.getBoundingClientRect();
  let left = coords.left + (row.offsetWidth - tooltip.offsetWidth) / 2;
  let top = coords.top - tooltip.offsetHeight - 5;
  tooltip.style.left = left + 'px';
  tooltip.style.top = top + 'px';
  setTimeout(() => tooltip.remove(), 2000);
}

function deleteData(index) {
  fetch(`server/deleteData.php?index=${index}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        getAllData();
      }
    })
    .catch(error => console.error(error));
}

document.addEventListener('DOMContentLoaded', getAllData);

document.getElementById('form').addEventListener('submit', event => {
  event.preventDefault();
  addNewData();
});

document.querySelector('#table thead').addEventListener('click', event => {
  if (event.target.tagName === 'TH') {
    let column = event.target.getAttribute('data-column');
    sortTable(column);
  }
});

document.querySelector('#table tbody').addEventListener('mouseover', event => {
  if (event.target.tagName === 'TD') {
    showTooltip(event);
  }
});

document.querySelector('#table tbody').addEventListener('click', event => {
  if (event.target.tagName === 'BUTTON') {
    let index = event.target.closest('tr').rowIndex - 1;
    deleteData(index);
  }
});

function naturalCompare(a, b) {
  let ax = [], bx = [];
  a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || '']); });
  b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || '']); });
  while (ax.length && bx.length) {
    let an = ax.shift();
    let bn = bx.shift();
    let nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
    if (nn) return nn;
  }
  return ax.length - bx.length;
}