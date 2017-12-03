<?php
// Title: DbOperation.php
// Author: Joshua Cockerill
//
// This class contains specific functions for querying data in
// the MySQL database connected to via dbconnection.php and constants.php
// for the Luna web api (handles SELECT, INSERT, UPDATE operations)
//
// References:
//   modified from https://www.simplifiedios.net/swift-php-mysql-tutorial/
//   by Belal Khan

class DbOperation
{
    public $errMessage = null;  //message if error occurs connecting to database
    private $conn = null;       //database connection if no error occurs

    /**
     * Constructor creates and connects with DbConnection
     * @param none
     * @return self
     */
    function __construct()
    {
        require_once dirname(__FILE__) . '/constants.php';
        require_once dirname(__FILE__) . '/dbconnection.php';
        // Try opening db connection
        $db = new DbConnection();
        $result = $db->connect();
        // Check for errors
        if ($result['error'])
        {
            $this->errMessage = $result['message'];
        }
        else
        {
            $this->conn = $result['message'];
        }
    }

    /**
     * Function to authenticate username/password on login
     * @param $username string of user to be authenticated
     * @param $pass string of user to be authenticated
     * @return bool whether or not username/password combination
     *   was found in the database
     */
    public function authenticateUser($username, $pass)
    {
        $stmt = $this->conn->prepare('SELECT uid FROM User WHERE username = ? AND password = ? AND active = 1');
        $stmt->bind_param('ss', $username, $pass);
        $stmt->execute();
        $stmt->store_result();
        // Return if results were found
        return $stmt->num_rows > 0;
    }

    /**
     * Function to create new user with a random emailID 
     * that is returned and sent to the new user in her
     * supplied email address
     * A new user row is created in the user table that 
     * has the emailID, and a random uid
     * @param no passed parameter required
     * @return $emailID: random ID sent to new user's email address
     *   when user successfully inserted in the database
     *   null if error
     */
    public function createUser()
    {
        //  create random emailID
        // although high probability that random function will
        // create a unique ID, it may not happen so:
        // check if created emailID in table, try 1000 times
        // to create a random emailD (if fails after 1000 tries,
        // must be randomizing bug). Terminating loop after 1000
        // times prevents endless loop when there is a bug
        $count = 0;     // Set loop count = 0
        $emailID = $this->genRandomString();
        // while emailID not unique && < 1000 tries
        while ($this->doesEmailIDExist($emailID) && $count < 1000) {
            $emailID = $this->genRandomString();
            $count++;   // increment count
        }   // end random ID while loop   
        if ($count < 1000)   // If unique emailID created
        {
            // Create random uid
            $uid = $this->createRandomUid();
            if ($uid > 0)   // no error created uid
            {
                $stmt = $this->conn->prepare('INSERT INTO User (emailID,uid) VALUES (?,?)');
                $stmt->bind_param('ss', $emailID,$uid);
                if ($stmt->execute())
                {
                    //User created successfully
                    return $emailID;
                }
                else
                {
                    //Error creating user
                    return null;
                }
            } else {    // Error creating user
                return null;
            }
        }
        else
        {
            // Error creating user no unique emailID
            return null;
        }
    }

    /**
     * Function to create a new incident in the database
     * @param $user_hash string containing hashed value of username
     *   reporting the logged incident
     * @param $location string of place where incident occurred
     * @param $date string of date incident occurred
     * @return bool whether or not the location was successfully
     *   inserted in the database
     */
    public function createIncident($user_hash, $location, $date)
    {
        $date = date('Y-m-d', strtotime(str_replace('-', '/', $date)));
        $stmt = $this->conn->prepare('INSERT INTO Incident (user_hash, incident_loc, incident_date) VALUES (?, ?, ?)');
        $stmt->bind_param('sss', $user_hash, $location, $date);
        if ($stmt->execute())
        {
            //Incident created successfully
            return true;
        }
        else
        {
            //Error creating Incident
            return false;
        }
    }

    /**
     * Function to change a users password
     * @param $username string of user who's password is being changed
     * @param $newPassword string to change user's password to
     * @return bool whether or not password was successfully updated
     *   in the database
     */
    public function changePassword($username, $newPassword)
    {
        $stmt = $this->conn->prepare('UPDATE User SET password = ? WHERE username = ?');
        $stmt->bind_param('ss', $newPassword, $username);
        if ($stmt->execute())
        {
            //Password changed successfully
            return true;
        }
        else
        {
            //Error changing password
            return false;
        }
    }

    /**
     * Function to deactivate a user
     * @param $username string of user to be deleted/deactivated
     * @return bool whether or not user was successfully set to
     *   inactive in the database
     */
    public function deleteUser($username)
    {
        $stmt = $this->conn->prepare('UPDATE User SET active = 0 WHERE username = ?');
        $stmt->bind_param('s', $username);
        if ($stmt->execute())
        {
            //User deleted successfully
            return true;
        }
        else
        {
            //Error deleting user
            return false;
        }
    }

    /**
     * Function to determine if a username already exists
     * @param $username string of name to be checked
     * @return bool whether or not username exists in the database
     *   regardless of activity status
     *   NOTE: keeps usernames unique
     */
    public function doesUserExist($username)
    {
        $stmt = $this->conn->prepare('SELECT uid FROM User WHERE username = ?');
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $stmt->store_result();
        // Return if results were found
        return $stmt->num_rows > 0;
    }
    
  /**
     * Function to determine if an emailID already exists
     * @param $emailID  to be checked
     * @return true (1): emailID exists in user table
               false (0): emailID does not exist in user table
     */
    public function doesEmailIDExist($emailID)
    {
        $stmt = $this->conn->prepare('SELECT uid FROM User WHERE emailID = ?');
        $stmt->bind_param('s', $emailID);
        $stmt->execute();
        $stmt->store_result();
        // Return if results were found
        return $stmt->num_rows > 0;
    }

    /**
     * Function to determine if a hashed username exists
     * @param $user_hash string containing hashed value of username
     *   reporting an incident to be logged
     * @return bool whether or not username exists in the database
     */
    public function doesHashedUserExist($user_hash)
    {
        $stmt = $this->conn->prepare('SELECT uid FROM User WHERE MD5(username) = ?');
        $stmt->bind_param('s', $user_hash);
        $stmt->execute();
        $stmt->store_result();
        // Return if results were found
        return $stmt->num_rows > 0;
    }

    /**
     * Function to generate random string of specified length
     * @param $length int number of chars of generated string
     * @return string of random chars using mt_rand and numbers,
     *   lowercase letters, and uppercase letters
     */
    private function genRandomString($length = 8)
    {
        $str = '';
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $max = strlen($chars) - 1;
        // Generate string with length number of chars
        for ($i = 0; $i < $length; ++$i)
        {
            // Get new random char and add to end of string
            $rand = mt_rand(0, $max);
            $str .= $chars[$rand];
        }
        // Return random string
        return $str;
    }
   
    /**
     * Function to authenticate userid exists in user table and is active
     * $uid: user ID to be authenticated
     * returns: true (1): uid exists and is active
     *          false (0): uid does not exist, or is not active
     */
    public function authenticateUid($uid)
    {       
        //does active User ID exist
        $stmt = $this->conn->prepare('SELECT uid FROM User WHERE uid = ? AND active = 1');
        $stmt->bind_param('s', $uid);
        $stmt->execute();
        $stmt->store_result();
        // Return if results were found
        return $stmt->num_rows > 0;
    }   // end of authenticateUid

   /**
     * Function to create random uid. Search user table uids
     * to ensure that it is not a duplicate
     * returns: random uid (0 if error)
     */

    public function createRandomUid()
    {       
        // create random uid
        // although high probability that random function will
        // create a unique ID, it may not happen so:
        // check if created random ID in table, try 1000 times
        // to create a random ID (if fails after 1000 tries,
        // must be randomizing bug). Terminating loop after 1000
        // times prevents endless loop when there is a bug
        // random uid starts at 11. 1-10 reserved for testing
        $count = 0;     // Set $count = 0
        $max = 100000;  // maximum random number
        $uid = mt_rand(11,$max); // get random number from 1 $max
        // while uid not unique && < 1000 tries
        while ($this->doesUidExist($uid) && $count < 1000) {
            $uid = mt_rand(11,$max); 
            $count++;   // increment count
        }   // end random ID while loop  
        // if random uid created count < 1000
        if ($count < 1000)
        {
            return $uid;
        } 
        else {
            return 0;
        }
    }   // end  createRandomUid

/**
     * findEmailID
     * Function to find emailID in user table on login, then:
     * 1 Put passed username and password in found user
     * 2 Set active flag on 
     * @param $emailID random emailID to search for
     * @param $username  (already hashed)
     * @param $password  (already hashed)
     * @return uid for the user from user table
     *  (0 if emailID not found)
     * (negative if error trying to change fields in user)
     */

    public function findEmailID($emailID, $username, $password)
    {         
        // Find emailID in user table
        $stmt = $this->conn->prepare('SELECT uid FROM User WHERE emailID = ? ');
        $stmt->bind_param('s', $emailID);
        $stmt->execute();
        $res = $stmt->get_result(); // get result of query
        // If emailID found
        if ($res->num_rows > 0) {
            // get uid from selected row
            $results = $res->fetch_assoc();  // fetch uid
            $uid = $results["uid"];
             // set password
             $stmt = $this->conn->prepare('UPDATE User SET password = ? WHERE emailID = ?');
             $stmt->bind_param('ss', $password, $emailID);
             if (!$stmt->execute())
             {   //  password error
                 return -2;
             } 
             // set username
             $stmt = $this->conn->prepare('UPDATE User SET username = ? WHERE emailID = ?');
             $stmt->bind_param('ss', $username,$emailID);
             if (!$stmt->execute())
             {   //  username error
                 return -3;
             } 
            // set active flag on
            $stmt = $this->conn->prepare('UPDATE User SET active = 1 WHERE emailID = ?');
            $stmt->bind_param('s', $emailID);
            if (!$stmt->execute())
            {  // active error
               return  -4;                      
            }  

        } else {    // else emailID not found, return 0
            $uid = 0;

        }
 
        return $uid;  // return positive uid

    }   // end findEmailID

   /**
     * doesUidExist
     * Function to determine if a uid already exists
     * @param $uid: uid to check 
     * @return  true (1) when uid exists in user table
     *   regardless of activity status
     *         false (0) uid not in user table         
     *   NOTE: keeps uids unique
     */

    public function doesUidExist($uid)
    {
        $stmt = $this->conn->prepare('SELECT uid FROM User WHERE uid = ?');
        $stmt->bind_param('s', $uid);
        $stmt->execute();
        $stmt->store_result();
        return $stmt->num_rows > 0;
    }   // end doesUidExist

    /**
     * Function to change an onboard question 
     *  $uid (user id): uid of user to change onboard questions 
     *  $birthday, $cycleLength,....  all 9 onboard questions
     *  followed in order
     * 
     * returns:  true onboard questions successfully changed
     *           false error changing onboard questions
     */

    public function changeOnboard($uid, $birthday, $cycleLength, $periodLength, $birthControlType, $lastPeriod, $status, $time, $pregnant, $reproductiveDisorder)
    {
        $stmt = $this->conn->prepare('UPDATE User SET birthday = ? WHERE uid = ?');
        $stmt->bind_param('ss', $birthday, $uid );
        if ($stmt->execute())
        {
            // data in column changed successfully
            // continue changing columns
        }
        else
        {
            //Error changing data
            return false;
        }
  
        $stmt = $this->conn->prepare('UPDATE User SET cycleLength = ? WHERE uid = ?');
        $stmt->bind_param('ss',  $cycleLength, $uid);
        if ($stmt->execute())
        {
            //data in column changed successfully
            // continue changing columns
        }
        else
        {
            //Error changing data
            // continue changing columns       
        }

        $stmt = $this->conn->prepare('UPDATE User SET periodLength = ? WHERE uid = ?');
        $stmt->bind_param('ss',   $periodLength, $uid);
        if ($stmt->execute())
        {
            //data in column changed successfully
            // continue changing columns

        }
        else
        {
            //Error changing data
            return false;
        }
        $stmt = $this->conn->prepare('UPDATE User SET birthControlType = ? WHERE uid = ?');
        $stmt->bind_param('ss',  $birthControlType, $uid);
        if ($stmt->execute())
        {
            //data in column changed successfully
            // continue changing columns
        }
        else
        {
            //Error changing data
            return false;
        }

        $stmt = $this->conn->prepare('UPDATE User SET lastPeriod = ? WHERE uid = ?');
        $stmt->bind_param('ss', $lastPeriod, $uid);
        if ($stmt->execute())
        {
            //data in column changed successfully
            // continue changing columns
        }
        else
        {
            //Error changing data
            return false;
        }
         $stmt = $this->conn->prepare('UPDATE User SET status = ? WHERE uid = ?');
        $stmt->bind_param('ss', $status, $uid);
        if ($stmt->execute())
        {
            //data in column changed successfully
            // continue changing columns
        }
        else
        {
            //Error changing data
            return false;
        }
 
        $stmt = $this->conn->prepare('UPDATE User SET time = ? WHERE uid = ?');
        $stmt->bind_param('ss', $time, $uid);
        if ($stmt->execute())
        {
            //data in column changed successfully
            // continue changing columns
        }
        else
        {
            //Error changing data
            return false;
        }
        $stmt = $this->conn->prepare('UPDATE User SET pregnant = ? WHERE uid = ?');
        $stmt->bind_param('ss',  $pregnant, $uid);
        if ($stmt->execute())
        {
            //data in column changed successfully
            // continue changing columns
        }
        else
        {
            //Error changing data
            return false;
        }
        $stmt = $this->conn->prepare('UPDATE User SET reproductiveDisorder = ? WHERE uid = ?');
        $stmt->bind_param('ss', $reproductiveDisorder, $uid);
        if ($stmt->execute())
        {
            //data in column changed successfully

        }
        else
        {
            //Error changing data
            return false;
        }
        // set onboard_status on (onboard questions answered)
        $stmt = $this->conn->prepare('UPDATE User SET onboard_status = 1 WHERE uid = ?');
        $stmt->bind_param('s', $uid);
        if (!$stmt->execute())
        {  // onboard_status error
           return  false;                      
        }  
        return true;  //   Success all columns updated
    } // end changeOnboard

    /**
     * Function to create a new daily question Entry in entry table
     *  $uid:  user ID
     *  $date: date incident occurred
     *  daily question data for all daily questions 
     * @return true: new row in entry table with daily question data
     *.        false: error creating new row in entry table
     */
    public function createEntry($uid, $entry_date, $onPeriod, $sexualInterest, $sexualAttitude, $sexualArousal, $kissing, $caressing, $fondling, $masturbation, $oral, $anal, $vaginal, $none, $other, $intensity)
    {

        $date = date('Y-m-d', strtotime(str_replace('-', '/', $date)));
        $stmt = $this->conn->prepare('INSERT INTO Entry (uid, entry_date, onPeriod, sexualInterest, sexualAttitude, sexualArousal, kissing, caressing, fondling, masturbation, oral, anal, vaginal, none, other, intensity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

        $stmt->bind_param('ssssssssssssssss', $uid, $entry_date, $onPeriod, $sexualInterest, $sexualAttitude, $sexualArousal, intval($kissing), intval($caressing), intval($fondling), intval($masturbation), intval($oral), intval($anal), intval($vaginal), intval($none), $other, $intensity);

        if ($stmt->execute())
        {
            //Entry created successfully
            return true;
        }
        else
        {
            //Error creating Entry
            return false;
        }
    }   // end of createEntry


    /**
     * Function to create a new Period in Period table
     *  $uid:  user ID
     *  $start_date: start date of period
     *  $end_date: end date of period
     * @return true: new row in Period table with start/end dates
     *.        false: error creating new row in Period table
     */

    public function createPeriod($uid, $start_date, $end_date)
    {

        $start_date = date('Y-m-d', strtotime(str_replace('-', '/', $start_date)));
        $end_date = date('Y-m-d', strtotime(str_replace('-', '/', $end_date)));
        $stmt = $this->conn->prepare('INSERT INTO Period (uid, mens_start, mens_end) VALUES (?, ?, ?)');

        $stmt->bind_param('sss', $uid, $start_date, $end_date);

        if ($stmt->execute())
        {
            //Entry created successfully
            return true;
        }
        else
        {
            //Error creating Entry
            return false;
        }
    }   // end of createEntry

    /**
     * Function to get user stats (Currently just from Period table)
     *  $uid:  user ID
     * @return average: the user's average cycle length. 
     *    if -1.0, error: user has no periods entered
     *        
     */
    public function getUserStats($uid)
    {
        $sql = "SELECT A.uid, AVG(TIMESTAMPDIFF(day,B.maxDate,A.mens_start)) AS average
                FROM Period AS A
                INNER JOIN
                (
                SELECT A2.uid, A2.pid, MAX(B2.mens_start) AS maxDate
                FROM Period AS A2
                INNER JOIN Period AS B2 ON A2.pid<>B2.pid AND A2.uid=B2.uid AND A2.mens_start>B2.mens_end
                GROUP BY B2.uid, B2.pid
                ) AS B ON A.uid=B.uid AND A.pid=B.pid
                GROUP BY A.uid
                HAVING A.uid=" . $uid;
        $result = $this->conn->query($sql);
        
        //this should only ever return 1 record (for a user)
        if ($result->num_rows == 1) {
            //echo "num rows: " . $result->num_rows . "<br>";
            $row = $result->fetch_assoc();
            return $row["average"];
        } else {
            return -1.0;
        }
    }   // end of getUserStats
    
    /**
    * Function to get birthday
    *  $username: username
    *  $password: password
    * @return birthday: the user's birthday
    *    if -1.0, error: user has no birthday entered
    */
    public function getBirthday($username, $password) {
	    $sql = "SELECT birthday
		    FROM User WHERE username = '" . $username . "' AND password = '" . $password . "'";
	    $result = $this->conn->query($sql);

	    // this should only ever return 1 record (for a user)
	    if ($result->num_rows == 1) {
	       $row = $result->fetch_assoc();
	       return $row["birthday"];
	    }
	    else {
	       return -1.0;
	    }
    } // end of getBirthday
    
    /**
    * Function to get cycle length
    *  $username: username
    *  $password: password
    * @return cycle length: the user's cycle length
    *    if -1.0, error: user has no cycle length entered
    */
    public function getCycleLength($username, $password) {
	    $sql = "SELECT cycleLength
		    FROM User WHERE username = '" . $username . "' AND password = '" . $password . "'";
	    $result = $this->conn->query($sql);

	    // this should only ever return 1 record (for a user)
	    if ($result->num_rows == 1) {
	       $row = $result->fetch_assoc();
	       return $row["cycleLength"];
	    }
	    else {
	       return -1.0;
	    }
    } // end of getCycleLength
    
    /**
    * Function to get period length
    *  $username: username
    *  $password: password
    * @return period length: the user's period length
    *    if -1.0, error: user has no period length entered
    */
    public function getPeriodLength($username, $password) {
	    $sql = "SELECT periodLength
		    FROM User WHERE username = '" . $username . "' AND password = '" . $password . "'";
	    $result = $this->conn->query($sql);

	    // this should only ever return 1 record (for a user)
	    if ($result->num_rows == 1) {
	       $row = $result->fetch_assoc();
	       return $row["periodLength"];
	    }
	    else {
	       return -1.0;
	    }
    } // end of getPeriodLength
    
    /**
    * Function to get birth control types
    *  $username: username
    *  $password: password
    * @return birth control types: the user's birth control types
    *    if -1.0, error: user has no birth control types entered
    */
    public function getBirthControlType($username, $password) {
	    $sql = "SELECT birthControlType
		    FROM User WHERE username = '" . $username . "' AND password = '" . $password . "'";
	    $result = $this->conn->query($sql);

	    // this should only ever return 1 record (for a user)
	    if ($result->num_rows == 1) {
	       $row = $result->fetch_assoc();
	       return $row["birthControlType"];
	    }
	    else {
	       return -1.0;
	    }
    } // end of getBirthControlType   
    
    /**
    * Function to get last period. This is the last period provided by the user in the onboarding questions.
    *  $username: username
    *  $password: password
    * @return last period: the user's last period
    *    if -1.0, error: user has no last period entered
    */
    public function getLastPeriod($username, $password) {
	    $sql = "SELECT lastPeriod
		    FROM User WHERE username = '" . $username . "' AND password = '" . $password . "'";
	    $result = $this->conn->query($sql);

	    // this should only ever return 1 record (for a user)
	    if ($result->num_rows == 1) {
	       $row = $result->fetch_assoc();
	       return $row["lastPeriod"];
	    }
	    else {
	       return -1.0;
	    }
    } // end of getLastPeriod
    
    /**
    * Function to get status
    *  $username: username
    *  $password: password
    * @return status: the user's relationship status
    *    if -1.0, error: user has no status entered
    */
    public function getStatus($username, $password) {
	    $sql = "SELECT status
		    FROM User WHERE username = '" . $username . "' AND password = '" . $password . "'";
	    $result = $this->conn->query($sql);

	    // this should only ever return 1 record (for a user)
	    if ($result->num_rows == 1) {
	       $row = $result->fetch_assoc();
	       return $row["status"];
	    }
	    else {
	       return -1.0;
	    }
    } // end of getStatus
    
    /**
    * Function to get time
    *  $username: username
    *  $password: password
    * @return time: the user's preferred time
    *    if -1.0, error: user has no time entered
    */
    public function getTime($username, $password) {
	    $sql = "SELECT time
		    FROM User WHERE username = '" . $username . "' AND password = '" . $password . "'";
	    $result = $this->conn->query($sql);

	    // this should only ever return 1 record (for a user)
	    if ($result->num_rows == 1) {
	       $row = $result->fetch_assoc();
	       return $row["time"];
	    }
	    else {
	       return -1.0;
	    }
    } // end of getTime
    
    /**
    * Function to get pregnant
    *  $username: username
    *  $password: password
    * @return pregnant: the user's desire to get pregnant
    *    if -1.0, error: user has no pregnancy desire entered
    */
    public function getPregnant($username, $password) {
	    $sql = "SELECT pregnant
		    FROM User WHERE username = '" . $username . "' AND password = '" . $password . "'";
	    $result = $this->conn->query($sql);

	    // this should only ever return 1 record (for a user)
	    if ($result->num_rows == 1) {
	       $row = $result->fetch_assoc();
	       return $row["pregnant"];
	    }
	    else {
	       return -1.0;
	    }
    } // end of getPregnant
    
    /**
    * Function to get reproductive disorders
    *  $username: username
    *  $password: password
    * @return reproductiveDisorders: the user's reproductive disorders
    *    if -1.0, error: user has no reproductive disorders entered
    */
    public function getReproductiveDisorder($username, $password) {
	    $sql = "SELECT reproductiveDisorder
		    FROM User WHERE username = '" . $username . "' AND password = '" . $password . "'";
	    $result = $this->conn->query($sql);

	    // this should only ever return 1 record (for a user)
	    if ($result->num_rows == 1) {
	       $row = $result->fetch_assoc();
	       return $row["reproductiveDisorder"];
	    }
	    else {
	       return -1.0;
	    }
    } // end of getReproductiveDisorder
    
    /**
    * Function to get uid
    *  $username: username
    *  $password: password
    * @return uid: the user's uid
    *    if -1.0, error: user has no uid
    */
    public function getUid($username, $password) {
	    $sql = "SELECT uid
		    FROM User WHERE username = '" . $username . "' AND password = '" . $password . "'";
	    $result = $this->conn->query($sql);

	    // this should only ever return 1 record (for a user)
	    if ($result->num_rows == 1) {
	       $row = $result->fetch_assoc();
	       return $row["uid"];
	    }
	    else {
	       return -1.0;
	    }
    } // end of getUid
    
    /**
    * Function to get onboard status
    *  $username: username
    *  $password: password
    * @return onboard_status: the user's onboard status
    *    if -1.0, error: user has no onboard status
    */
    public function getOnboardStatus($username, $password) {
	    $sql = "SELECT onboard_status
		    FROM User WHERE username = '" . $username . "' AND password = '" . $password . "'";
	    $result = $this->conn->query($sql);

	    // this should only ever return 1 record (for a user)
	    if ($result->num_rows == 1) {
	       $row = $result->fetch_assoc();
	       return $row["onboard_status"];
	    }
	    else {
	       return -1.0;
	    }
    } // end of getOnboardStatus

    /**
    * Function to get lastPeriodStartDate. This is the last period used by the application to track the user's actual period, via daily questions.
    *  $username: username
    *  $password: password
    * @return date: the user's last period date as set by the application.
    *    if null, the user hasn't specified that they are currently on their period.
    */
    public function getLastPeriodStartDate($username, $password) {
        $sql = "SELECT lastPeriodStartDate
            FROM User WHERE username = '" . $username . "' AND password = '" . $password . "'";
        $result = $this->conn->query($sql);

        // this should only ever return 1 record (for a user)
        if ($result->num_rows == 1) {
           $row = $result->fetch_assoc();
           return $row["lastPeriodStartDate"];
        }
        else {
           return -1.0;
        }
    } // end of getBirthControlType  
    
    /**
     * Function to check if emailID exists in user table and is active
     * $emailID: user emailID to be authenticated
     * returns: true (1): emailID exists and is active
     *          false (0): emailID does not exist or is not active
     */
    public function isEmailIDActive($emailID)
    {       
        //does active emailID exist
        $stmt = $this->conn->prepare('SELECT uid FROM User WHERE emailID = ? AND active = 1');
        $stmt->bind_param('s', $emailID);
        $stmt->execute();
        $stmt->store_result();
        // Return if results were found
        return $stmt->num_rows > 0;
    }   // end of isEmailIDActive

     /**
     * Function to check if user has already entered daily question
     * $uid: User ID to check
     * $entry_date: Current date
     * returns: true (1): daily questions have been completed
     *          false (0): daily questions have not been completed
     */
     public function areDailyQuestionsSubmitted($uid, $entry_date) {
         
         $date = date('Y-m-d', strtotime(str_replace('-', '/', $entry_date)));
         
         // Check if there is already a daily questions submission for the day
         $stmt = $this->conn->prepare('SELECT eid FROM Entry WHERE uid = ? AND entry_date = ?');
         $stmt->bind_param('ss', $uid, $date);
         $stmt->execute();
         $stmt->store_result();
         
         // Return if results were found
         return $stmt->num_rows > 0;
     }  // end of areDailyQuestionsSubmitted

     /**
     * Function to change a user's last period start date.
     *  $uid (user id): uid of user to change onboard questions 
     *  $lastPeriodStartDate: start date of the user's current period.
     * 
     * returns:  true last period start date successfully changed
     *           false error changing last period start date
     */
    public function changePeriodStartDate($uid, $lastPeriodStartDate)
    {
        $stmt = $this->conn->prepare('UPDATE User SET lastPeriodStartDate = ? WHERE uid = ?');
        $stmt->bind_param('ss', $lastPeriodStartDate, $uid );
        if ($stmt->execute())
        {
            return true;
        }
        else
        {
            //Error changing data
            return false;
        }
    } // end changePeriodStartDate

}  // end of DbOperation class

