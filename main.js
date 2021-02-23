document.getElementById('issueInputForm').addEventListener('submit', submitIssue);

function submitIssue(e) {
  const getInputValue = id => document.getElementById(id).value;
  const description = getInputValue('issueDescription');
  const severity = getInputValue('issueSeverity');
  const assignedTo = getInputValue('issueAssignedTo');
  const id = Math.floor(Math.random() * 100000000) + '';
  const status = 'Open';

  const issue = { id, description, severity, assignedTo, status };
  let issues = [];
  if (localStorage.getItem('issues')) {
    issues = JSON.parse(localStorage.getItem('issues'));
  }

  issues.push(issue);
  localStorage.setItem('issues', JSON.stringify(issues));

  document.getElementById('issueInputForm').reset();
  countIssue('add');
  fetchIssues();
  e.preventDefault();
}

const setStatusClosed = id => {
  const issues = JSON.parse(localStorage.getItem('issues'));
  const currentIssue = issues.find(issue => issue.id == id);
  if(currentIssue.status!='Closed'){
  currentIssue.status = 'Closed';
  localStorage.setItem('issues', JSON.stringify(issues));
  countIssue('close');
  }
  fetchIssues();
}

// const setStatusClosed = id => {
//   const issues = JSON.parse(localStorage.getItem('issues'));
//   for (let i = 0; i < issues.length; i++) {
//     const element = issues[i].id;

//     if (parseInt(element) === parseInt(id)) {
//       issues[i].status = 'Closed';
//       console.log(issues);
//     }
//   }
//   localStorage.setItem('issues', JSON.stringify(issues));
//   fetchIssues();
// }
const deleteIssue = id => {
  let flag =0;
  const remainingIssues = [];
  const issues = JSON.parse(localStorage.getItem('issues'));
  for (let i = 0; i < issues.length; i++) {
    const element = issues[i].id;
    const checkStatus = issues[i].status;
    if (checkStatus == 'Closed'){
      countIssue('delete');
      flag = 1;
    }
    if (parseInt(element) !== parseInt(id)) {
      remainingIssues.push(issues[i]);
    }
  }
  if(flag === 0)
  countIssue('all');
  //const remainingIssues = issues.filter(issues.id != id)
  localStorage.setItem('issues', JSON.stringify(remainingIssues));
  fetchIssues();
}

function countIssue(value) {
  let openCount = 0, totalCount = 0;
  if (localStorage.getItem("openCount")) {
    openCount = JSON.parse(localStorage.getItem('openCount'));
    if (openCount == null) {
      openCount = 0;
    }
    openCount = parseInt(openCount);
  }
  if (localStorage.getItem("totalCount")) {
    totalCount = JSON.parse(localStorage.getItem('totalCount'));
    if (totalCount == null) {
      totalCount = 0;
    }
    totalCount = parseInt(totalCount);
  }
  if (value === 'add') {
    openCount++;
    totalCount++;
  }
  else if (value === 'close') {
    openCount--;
  }
  else if (value === 'delete') {
    totalCount--;
  }
  else if(value === 'all') {
    totalCount--;
    openCount--;
  }
  console.log(openCount, totalCount);
  localStorage.setItem('openCount', JSON.stringify(openCount));
  localStorage.setItem('totalCount', JSON.stringify(totalCount));
  document.getElementById("open-count").innerText = openCount;
  document.getElementById("total-count").innerText = totalCount;
}

const fetchIssues = () => {
  //localStorage.removeItem("openCount");
  //localStorage.removeItem("totalCount");
  const issues = JSON.parse(localStorage.getItem('issues'));
  const issuesList = document.getElementById('issuesList');
  issuesList.innerHTML = '';
  const openIssue = JSON.parse(localStorage.getItem('openCount'));
  const totalIssue = JSON.parse(localStorage.getItem('totalCount'));
  document.getElementById("open-count").innerText = openIssue;
  document.getElementById("total-count").innerText = totalIssue;

  for (var i = 0; i < issues.length; i++) {
    const { id, description, severity, assignedTo, status } = issues[i];

    issuesList.innerHTML += `<div class="well">
                              <h6>Issue ID: ${id} </h6>
                              <p><span class="label label-info"> ${status} </span></p>
                              <h3> ${description} </h3>
                              <p><span class="glyphicon glyphicon-time"></span> ${severity}</p>
                              <p><span class="glyphicon glyphicon-user"></span> ${assignedTo}</p>
                              <a href="#" onclick="setStatusClosed(${id})" class="btn btn-warning">Close</a>
                              <a href="#" onclick="deleteIssue(${id})" class="btn btn-danger">Delete</a>
                              </div>`;
  }
}
