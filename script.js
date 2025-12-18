// Declaring variables
const buttons = document.querySelectorAll(".copy-button");
const svg = document.querySelector(".svg-container");
const checkmarkSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
    <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
  </svg>
`
const copySVG = `
  <svg  width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 3H14.6C16.8402 3 17.9603 3 18.816 3.43597C19.5686 3.81947 20.1805 4.43139 20.564 5.18404C21 6.03969 21 7.15979 21 9.4V16.5M6.2 21H14.3C15.4201 21 15.9802 21 16.408 20.782C16.7843 20.5903 17.0903 20.2843 17.282 19.908C17.5 19.4802 17.5 18.9201 17.5 17.8V9.7C17.5 8.57989 17.5 8.01984 17.282 7.59202C17.0903 7.21569 16.7843 6.90973 16.408 6.71799C15.9802 6.5 15.4201 6.5 14.3 6.5H6.2C5.0799 6.5 4.51984 6.5 4.09202 6.71799C3.71569 6.90973 3.40973 7.21569 3.21799 7.59202C3 8.01984 3 8.57989 3 9.7V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.0799 21 6.2 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`
// Copy text function
buttons.forEach(button => {
  button.addEventListener('click', function (e) {
    // Prevent default
    e.preventDefault();

    // Find the <p> inside the clicked element
    const text = this.querySelector('p').innerText;

    // Copy text to clipboard
    navigator.clipboard.writeText(text).then(() => {
      console.log(`Text copied ${text}`);

      // Change the copy icon to check icon
      svg.innerHTML = checkmarkSVG;

      setTimeout(() => {
        svg.innerHTML = copySVG;
      }, 2000)
    }).catch(err => {
      console.log(`Text not copied. ${err}`);
    })
  })
}
);



// Function to fetch the JSON data and display the projects
async function fetchAndDisplayProjects() {
  const container = document.getElementById('projects-container');
  container.innerHTML = ''; // Clear the "" message

  try {
    // 1. Fetch the data from the local JSON file
    const response = await fetch('projects.json');

    // Check if the fetch was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 2. Parse the JSON data
    const projects = await response.json();

    // 3. Loop through each project and create the HTML structure
    projects.forEach(project => {
      // Create the main project div
      const projectDiv = document.createElement('div');
      projectDiv.className = 'project-card';

      // Create and set the content for each field
      projectDiv.innerHTML = `
        <div class="flex-container text-container container-border">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <p class="project-type"><strong>Type:</strong> ${project.type}</p>
        <p class="project-technologies"><strong>Tech:</strong> ${project.technologies.join(', ')}</p>
        <a href="${project.link}" class="cta-button">View Project</a>
        </div>
      `;

      // 4. Append the new project div to the container
      container.appendChild(projectDiv);
    });

  } catch (error) {
    // Handle any errors during fetching or processing
    console.error('Error fetching or processing projects:', error);
    container.innerHTML = '<p class="error">Could not load projects. Please check the projects.json file path and format.</p>';
  }
}

// Execute the function when the script loads
fetchAndDisplayProjects();
