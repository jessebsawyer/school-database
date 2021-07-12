import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const CourseDetail = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [courses, setCourses] = useState([]);
  const { id } = useParams();
  let params = id.substring(1);

  useEffect(() => {
    fetch(`/api/courses/${params}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setCourses(result);
          console.log(params);
        },

        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [params]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <div className='actions--bar'>
          <div className='bounds'>
            <div className='grid-100'>
              <span>
                <Link className='button' to='/courses/update'>
                  Update Course
                </Link>
                <Link className='button' to='/courses/delete'>
                  Delete Course
                </Link>
              </span>
              <Link className='button button-secondary' to='/'>
                Return to List
              </Link>
            </div>
          </div>
        </div>
        <div className='bounds course--detail'>
          <div className='grid-66'>
            <div className='course--header'>
              <h4 className='course--label'>Course</h4>
              <h3 className='course--title'>{courses.title}</h3>
              <p>{courses.name}</p>
            </div>
            <div className='course--description'>
              <p>{courses.description}</p>
            </div>
          </div>
          <div className='grid-25 grid-right'>
            <div className='course--stats'>
              <ul className='course--stats--list'>
                <li className='course--stats--list--item'>
                  <h4>Estimated Time</h4>
                  <h3>{courses.estimatedTime}</h3>
                </li>
                <li className='course--stats--list--item'>
                  <h4>Materials Needed</h4>
                  <ul>
                    <li>{courses.materialsNeeded}</li>
                    {console.log(courses.materialsNeeded)}
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default CourseDetail;
