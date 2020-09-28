/*post register (put new user into db) */
function postRegistration(req) {
    let email = req.body.email;
    let password;
    if (req.body.password) password = req.body.password;
    else password = '111'; // need to change
    if (req.body.name) name = req.body.name;
    else name = '';
    if (req.body.bio) bio = req.body.bio;
    else bio = '';
    if (req.body.characteristics) characteristics = JSON.stringify(req.body.characteristics);
    else characteristics = JSON.stringify({});
    if (req.body.interests) interests = JSON.stringify(req.body.interests);
    else interests = JSON.stringify({});
    return new Promise(resolve => {
      try {
        let res;
        let con = mysql.createConnection(dbInfo);
        res = con.query(`INSERT INTO student (username, password, name, email, phone number, class_list) VALUES (${mysql.escape(username)}, ${mysql.escape(password)}, ${mysql.escape(name)});`, (error, results, fields) => {
          if (error) {
            console.log(error.stack);
            con.end();
            resolve({ error: true, message: error })
          }
          
          if (results) {
            console.log(`${email} profile registered.`);
            con.end();
            resolve({ error: false, message: results });
          }
          else {
            con.end();
            resolve({ error: true, message: 'Something Went Wrong. Try Again later.' })
          }
        });
      } catch (error) {
        resolve({ error: true, message: error })
      }
    });
  }