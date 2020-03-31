import React, {useState} from 'react';
import * as Icon from 'react-feather';
import {useTranslation} from 'react-i18next';

const goldenNumber = 0; // Bump number up to issue new popup

function Level(props) {
  const [popup, setPopup] = useState(
    localStorage.getItem('popup') === null
      ? localStorage.setItem('popup', goldenNumber)
      : localStorage.getItem('popup') < goldenNumber.toString()
      ? localStorage.setItem('popup', goldenNumber)
      : localStorage.getItem('popup') === goldenNumber.toString()
      ? true
      : false
  );

  const {t} = useTranslation();

  return (
    <React.Fragment>
      {popup && (
        <div className="snackbar fadeInUp" style={{animationDelay: '3s'}}>
          <h4>{t('Added support for more languages!')}</h4>
          <Icon.XCircle
            onClick={() => {
              localStorage.setItem('popup', goldenNumber + 1);
              setPopup(false);
            }}
          />
        </div>
      )}
    </React.Fragment>
  );
}

export default Level;
