<?php 
if(isset($_POST['submit'])){
    $to = "deep.shah1625@gmail.com"; // this is your Email address
    $from = $_POST['email']; // this is the sender's Email address
    // $first_name = $_POST['first_name'];
    // $last_name = $_POST['last_name'];
    $first_name = "Deep";
    $last_name = "Shah";
    $subject = "Form submission";
    $subject2 = "Copy of your form submission";
    // $message = $first_name . " " . $last_name . " wrote the following:" . "\n\n" . $_POST['message'];
    $message = $first_name . " " . $last_name . " wrote the following:" . "\n\n" . "Hello World";
    // $message2 = "Here is a copy of your message " . $first_name . "\n\n" . $_POST['message'];
    $message2 = "Here is a copy of your message " . $first_name . "\n\n" . "Hello World";
    $headers = "From:" . $from;
    $headers2 = "From:" . $to;
    mail($to,$subject,$message,$headers);
    mail($from,$subject2,$message2,$headers2); // sends a copy of the message to the sender
    echo "Mail Sent. Thank you " . $first_name . ", we will contact you shortly.";
    // You can also use header('Location: thank_you.php'); to redirect to another page.
    }
?>

<!DOCTYPE html>
<head>
<title>Form submission</title>
<link rel="stylesheet" type="text/css" href="./../css/bootstrap.css">
</head>
<body>

	<form action="" method="post">
  <div class="form-group">
    <label for="exampleInputEmail1">Email address</label>
    <input type="email" class="form-control" name="email" id="email" aria-describedby="emailHelp" placeholder="Enter email">
    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
  </div>
  <div class="form-group">
    <label for="exampleSelect1">Example select</label>
    <select class="form-control" id="exampleSelect1">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </select>
  </div>
  <div class="form-group">
    <label for="exampleSelect2">Example multiple select</label>
    <select multiple class="form-control" id="exampleSelect2">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </select>
  </div>
  <div class="form-group">
    <label for="exampleTextarea">Example textarea</label>
    <textarea class="form-control" id="exampleTextarea" rows="3"></textarea>
  </div>
  <div class="form-group">
    <label for="exampleInputFile">File input</label>
    <input type="file" class="form-control-file" id="exampleInputFile" aria-describedby="fileHelp">
    <small id="fileHelp" class="form-text text-muted">This is some placeholder block-level help text for the above input. It's a bit lighter and easily wraps to a new line.</small>
  </div>
  <fieldset class="form-group">
    <legend>Radio buttons</legend>
    <div class="radio">
      <label>
        <input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" checked>
        Option one is this and that&mdash;be sure to include why it's great
      </label>
    </div>
    <div class="radio">
      <label>
        <input type="radio" name="optionsRadios" id="optionsRadios2" value="option2">
        Option two can be something else and selecting it will deselect option one
      </label>
    </div>
    <div class="radio disabled">
      <label>
        <input type="radio" name="optionsRadios" id="optionsRadios3" value="option3" disabled>
        Option three is disabled
      </label>
    </div>
  </fieldset>
  <div class="checkbox">
    <label>
      <input type="checkbox"> Check me out
    </label>
  </div>
  <button type="submit" name="submit" class="btn btn-primary">Submit</button>
</form>

</body>
</html>