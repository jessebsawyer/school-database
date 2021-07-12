import React, { useState, useEffect } from 'react';

const Courses = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('/api/courses')
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setCourses(result);
        },

        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className='bound'>
        {courses.map((course) => (
          <div className='grid-33' key={course.id}>
            <a
              className='course--module course--link'
              href={`courses/:${course.id}`}
            >
              <h4 className='course--label'>Course</h4>
              <h3 className='course--title'>{course.title}</h3>
            </a>
          </div>
        ))}
        <div className='grid-33'>
          <a
            className='course--module course--add--module'
            href='/courses/create'
          >
            <h3 className='course--add--title'>
              <svg
                version='1.1'
                xmlns='http://www.w3.org/2000/svg'
                x='0px'
                y='0px'
                viewBox='0 0 13 13'
                className='add'
              >
                <polygon points='7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 '></polygon>
              </svg>
              New Course
            </h3>
          </a>
        </div>
      </div>
    );
  }
};

export default Courses;
