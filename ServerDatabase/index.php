<?php
// Title: Index
// Author: Joshua Cockerill
//
// This file contains a script to see if a date of birth is within
// the required range for the study, displays a consent form, and
// redirects upon successful submission
//

$dobError = '';
$dob = 'mm/dd/yyyy';
// If post method, check date of birth
if ($_SERVER["REQUEST_METHOD"] == "POST")
{
    // Dob is required
    if (isset($_POST['dob']) && !empty($_POST['dob']))
    {
        $dob = $_POST['dob'];
        // Check between 18 and 25 years old
        $birthdate = new DateTime($dob);
        $today   = new DateTime('today');
        $age = $birthdate->diff($today)->y;
        if ($age >=18 && $age <=25)
        {
            // Redirect browser
            header("Location: https://luna-app.000webhostapp.com/api/v1/register.php");
            exit();
        }
        // Invalid dob for research
        else
        {
            $dobError = "<label style='color: red;'>Age must be between 18 and 25 for this study</label>";
        }
    }
    else
    {
        $dobError = "<label style='color: red;'>Birthday is required</label>";
    }
}
?>

<html>
<body>
<div style="width: 75%;margin: 0 auto;align-content: center;">
    <p style="text-align: center">
        Consent to Participate in a Research Study<br><br>
        <span style="font-weight: bold">Behavior and the Menstrual Cycle</span><br>
    </p>
    <p>
        <span style="font-weight: bold">WHY ARE YOU BEING INVITED TO TAKE PART IN THIS RESEARCH?</span><br>
        You are being invited to take part in a research study about how a woman's behavior changes over the
        menstrual cycle. We are looking for heterosexual women between the ages of 18 and 25 who use Apple
        (iOS) mobile devices. If you volunteer to take part in this study, you will be one of about 1,000 people to
        do so.<br><br>
        <span style="font-weight: bold">WHO IS DOING THE STUDY?</span><br>
        The person in charge of this study is Kaylynne Glover, a PhD student, of the University of Kentucky
        Department of Biology. She is being guided in this research by Philip Crowley. There may be other
        people on the research team assisting at different times during the study. If this research is approved for
        funding, this research will be funded by the National Institute of Justice (NIJ).<br><br>
        <span style="font-weight: bold">WHAT IS THE PURPOSE OF THIS STUDY?</span><br>
        By doing this study, we hope to learn more about how our behavior is influenced by the hormones of the
        menstrual cycle.<br><br>
        <span style="font-weight: bold">ARE THERE REASONS WHY YOU SHOULD NOT TAKE PART IN THIS STUDY?</span><br>
        We are interested in women between the ages of 18 and 25 who use an Apple mobile device, and you
        should not participate in this study if you do not meet these qualifications.<br><br>
        <span style="font-weight: bold">WHERE IS THE STUDY GOING TO TAKE PLACE AND HOW LONG WILL IT LAST?</span><br>
        The research will be collected via an app on your mobile device which you will download and use to
        track your menstrual cycle. After the initial set-up of the application, the app will ask you a series of
        questions at the end of every day about your behavior. It should not take you more than five minutes to
        answer these questions. You will not be required to go to a facility or meet with any researchers. If you
        choose to participate, we ask that you use this app regularly for at least 3 months but encourage you to
        use it for the full length of the study, 2 years.<br><br>
        <span style="font-weight: bold">WHAT WILL YOU BE ASKED TO DO?</span><br>
        To participate in this research, we will ask you to download an application to an Apple mobile device.
        This app will be used to track your menstrual cycle, and you will be asked to put in basic demographic
        and menstrual-related information. We will ask you to regularly update the app with any changes (i.e.
        when your period starts or stops, if you start using a different kind of contraceptive, etc.), and it will
        periodically prompt you to remember to input this information. We will also periodically ask questions
        about things you do throughout the day. We ask that you respond at least daily as accurately as you can.
        Responding to the questions should not take more than a few minutes. We will collect data for up to 2
        years; if you choose to participate, we ask that you participate for at least 3 months, though the longer
        you participate, the more information we can collect.<br><br>
        <span style="font-weight: bold">WHAT ARE THE POSSIBLE RISKS AND DISCOMFORTS?</span><br>
        To the best of our knowledge, the things you will be doing have no more risk of harm than you would
        experience in everyday life.<br><br>
        While the app aims to track your menstrual cycle, it is not a medical tool, nor does it provide medical
        advice or any type of diagnosis. Because every woman's menstrual cycle is different, the app may
        indicate that your period should begin at a certain day when it doesn't. If you become concerned about
        your menstrual cycle, please contact a health professional.<br><br>
        We may periodically ask you questions concerning your behavior and your perception of events. We do
        not expect that you will experience any discomfort in answering these questions, but it may be possible.
        In addition to the risks listed above, you may experience a previously unknown risk or side effect.<br><br>
        <span style="font-weight: bold">WILL YOU BENEFIT FROM TAKING PART IN THIS STUDY?</span><br>
        There is no guarantee that you will get any benefit from taking part in this study. However, some
        women have found having knowledge about their menstrual cycle helpful and useful. In addition to this,
        your willingness to take part may, in the future, help society as a whole better understand this research
        topic.<br><br>
        <span style="font-weight: bold">DO YOU HAVE TO TAKE PART IN THE STUDY?</span><br>
        If you decide to take part in the study, it should be because you really want to volunteer. You will not
        lose any benefits or rights you would normally have if you choose not to volunteer. You can stop at any
        time during the study and still keep the benefits and rights you had before volunteering. All you need to
        do is to delete the app and confirm that you want to end the study. If you delete the app before the
        research concludes, your data will be used and analyzed in the study.<br><br>
        <span style="font-weight: bold">IF YOU DON'T WANT TO TAKE PART IN THE STUDY, ARE THERE OTHER CHOICES? </span><br>
        If you do not want to be in the study, there are no other choices except not to take part in the study.<br><br>
        <span style="font-weight: bold">WHAT WILL IT COST YOU TO PARTICIPATE?</span><br>
        There are no costs associated with taking part in the study.<br><br>
        <span style="font-weight: bold">WILL YOU RECEIVE ANY REWARDS FOR TAKING PART IN THIS STUDY?</span><br>
        You will not receive any rewards or payment for taking part in the study.<br><br>
        <span style="font-weight: bold">WHO WILL SEE THE INFORMATION THAT YOU GIVE?</span><br>
        Only those involved in this research will see the information you provide us. We will not record any
        personal information that could be used to identify you. The information you provide may be examined
        by other researchers or people who need to be sure we have done the research correctly; these would be
        people from such organizations as the University of Kentucky.<br><br>
        Your information will be combined with information from other people taking part in the study. When
        we write about the study to share it with other researchers, we will write about the combined information
        we have gathered. You will not be personally identified in these written materials. We may publish the
        results of this study; however, as we will not collect any personally identifying information, nothing we
        publish could be tracked back to you.<br><br>
        We will make every effort to prevent anyone who is not on the research team from knowing that you
        gave us information, or what that information is. All the data from this study will be stored digitally in a
        secure web server that requires authentication to access. Your name will not be recorded, and your
        information will be associated with a randomly assigned user ID, and no one will be able to identify who
        you are through our data. The information will not be shared with anyone outside of the research study
        and will only be accessible through the secure database during the data collection phase. When the data
        is downloaded for analysis, it will be protected on a laptop with password protection on both the laptop
        and the file itself.<br><br>
        <span style="font-weight: bold">CAN YOUR TAKING PART IN THE STUDY END EARLY?</span><br>
        If you decide to take part in the study you still have the right to decide at any time that you no longer
        want to continue. You will not be treated differently if you decide to stop taking part in the study.
        The individuals conducting the study may need to withdraw you from the study. This may occur if you
        are not able to follow the directions they give you or if they find that your being in the study is more risk
        than benefit to you. There are no consequences of withdrawing. If you choose to withdraw, all you need
        to do is to delete the app and confirm that you want to end the study. The data that you have already
        entered will be used and analyzed.<br><br>
        <span style="font-weight: bold">WHAT ELSE DO YOU NEED TO KNOW?</span><br>
        There is a possibility that the data collected from you may be shared with other investigators in the
        future. If that is the case the data will not contain information that can identify you unless you give your
        consent or the UK Institutional Review Board (IRB) approves the research. The IRB is a committee that
        reviews ethical issues, according to federal, state and local regulations on research with human subjects,
        to make sure the study complies with these before approval of a research study is issued.<br><br>
        <span style="font-weight: bold">WHAT IF YOU HAVE QUESTIONS, SUGGESTIONS, CONCERNS, OR COMPLAINTS?</span><br>
        Before you decide whether to accept this invitation to take part in the study, please ask any questions
        that might come to mind now. Later, if you have questions, suggestions, concerns, or complaints about
        the study, you can contact the investigator, Kaylynne Glover at kaylynnemglover@gmail.com. If you
        have any questions about your rights as a volunteer in this research, contact the staff in the Office of
        Research Integrity at the University of Kentucky between the business hours of 8am and 5pm EST,
        Mon-Fri. at 859-257- 9428 or toll free at 1-866- 400-9428. You can print or save a copy of this
        form if you choose.<br><br>
        <a href="LunaAppConsentForm.pdf" style="color: blue;">Print or Download Consent Form</a>
        <br><br>
        By entering your date of birth below, you are consenting to participate in our research study and affirm
        that you are between the ages of 18 and 25, are female, and use an Apple mobile device.<br>
    </p>
    <form method='post'>
        Birthday: <input type="date" name="dob" value="<?php echo $dob; ?>" required>
        <?= $dobError ?>
        <br><br>
        <input type="submit" value="I Consent">
    </form>
</div>
</body>
</html>