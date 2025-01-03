let student_data;

/* Created outside of fetch so it could be altered later */
let num_students = document.getElementById("num-results");

fetch("https://cs571api.cs.wisc.edu/rest/f24/hw2/students", {
	method: "GET",
	headers: {
		"X-CS571-ID": CS571.getBadgerId()
	}
})
.then(response => response.json())
.then(data => {
	/* Took copy example from lecture */
	student_data = JSON.parse(JSON.stringify(data));
	console.log(data);
	num_students.innerText = data.length;
	buildStudents(data);
})
.catch(error => console.error(error))

function buildStudents(studs) {
	// TODO This function is just a suggestion! I would suggest calling it after
	//      fetching the data or performing a search. It should populate the
	//      index.html with student data by using createElement and appendChild.
	const students = document.getElementById("students");
	students.innerHTML = '';
	for (let i = 0; i < studs.length; i++) {
		const stud = studs[i];
		/* I used this resource to better understand how div works: https://www.w3schools.com/tags/tag_div.ASP */
		const student = document.createElement("div");

		/* Used this link and lecture examples to better understand Bootstrap: https://getbootstrap.com/docs/4.0/layout/grid/ */
		student.className = "col-12 col-md-6 col-lg-4 col-xl-3";
		
		const name = document.createElement("h1");
		name.innerText = stud.name.first + " " + stud.name.last
		student.appendChild(name);

		const major = document.createElement("p");
		major.innerText = stud.major;

		/* Asked Prof Nelson how to make something bold */
		const bold_major = document.createElement("strong");
		bold_major.appendChild(major);
		student.appendChild(bold_major);

		/* I used this resource to figure out how to convert integers to strings in JS: https://www.w3schools.com/jsref/jsref_tostring_number.asp */
		const credit = document.createElement("p");
		if (stud.fromWisconsin == true) {
			credit.innerText = stud.name.first + " is taking " + (stud.numCredits).toString() + " credits and is from Wisconsin.";
		}
		else {
			credit.innerText = stud.name.first + " is taking " + (stud.numCredits).toString() + " credits and is NOT from Wisconsin.";
		}
		student.appendChild(credit);

		const num_interests = document.createElement("p");
		num_interests.innerText = "They have " + (stud.interests.length).toString() + " interests including...";
		student.appendChild(num_interests);

		const interests = document.createElement("ul");
		for (let j = 0; j < stud.interests.length; j++) {
			const interest = document.createElement("li");
			interest.innerText = stud.interests[j];
			
			/* Used HW Instructions to do this part */
			interest.addEventListener("click", (e) => {
				const selectedText = e.target.innerText;

				/* Clear the previous values and set the new search interest */
				document.getElementById("search-name").value = '';
				document.getElementById("search-major").value = '';
				document.getElementById("search-interest").value = selectedText;
				handleSearch(e);
			});

			interests.appendChild(interest);
		}
		student.appendChild(interests);

		students.appendChild(student)
	}
}

function handleSearch(e) {
	e?.preventDefault(); // You can ignore this; prevents the default form submission!

	/* Used this link to figure out how leading and trailing spaces could be ignored: https://www.w3schools.com/jsref/jsref_trim_string.asp */
	/* Used this link to make everything case insensitive: https://www.w3schools.com/jsref/jsref_tolowercase.asp */

	/* Whitespaces are ignored and everything is lower case */
	const search_name = document.getElementById("search-name").value.trim().toLowerCase();
	const search_major = document.getElementById("search-major").value.trim().toLowerCase();
	const search_interest = document.getElementById("search-interest").value.trim().toLowerCase();

	/* Use the filter function like the lecture examples */
	const filter = student_data.filter(n => {
		/* Whitespaces are ignored and everything is lower case */
		const student_name = (n.name.first + " " + n.name.last).trim().toLowerCase();
		/* Used this link to better understand JavaScript comparisons: https://www.w3schools.com/js/js_comparisons.asp */
		/* Used this link to figure out how if a string contained a substring: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes */
		const name_search = (search_name === student_name) || (student_name.includes(search_name));

		/* Whitespaces are ignored and everything is lower case */
		const student_major = (n.major).trim().toLowerCase();
		const major_search = (search_major === student_major) || (student_major.includes(search_major));

		/* Whitespaces are ignored and everything is lower case */
		/* Use the map function to make everything lowercase and ignore the whitespaces */
		const student_interest = (n.interests).map(m => m.trim().toLowerCase());
		/* Use the some function to check if any interests contain the searched interest */
		const interest_search = student_interest.some(interest => interest.includes(search_interest));

		/* Return values determine what will be part of the filter variable */
		return name_search && major_search && interest_search;
	});

	/* Upated the number of students here and build again */
	num_students.innerText = filter.length;
	buildStudents(filter);
	// TODO Implement the search
}

document.getElementById("search-btn").addEventListener("click", handleSearch);