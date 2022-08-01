<!-- This content gets rendered inside a container div if the user is signed in. -->
<div class="spacer"></div>
<div class="spacer"></div>
<div class="row">
    <div class="text-center col">
        <h1 class="hero-header">Welcome, <?= $_SESSION['loginSession'][0]; ?></h1>
    </div>
</div>
<div class="spacer"></div>
<div class="row">
    <div class="text-center col">
        <h3 class="hero-header">Notes:</h3>
        <iframe src="components/myNotes.php"></iframe>
    </div>
    <div class="text-center col">
        <h3 id="currentPasteNameLabel" class="hero-header">New Paste</h3>
        <div class="card">
            <header>
                <input class="textfield noteCardInput" placeholder="Title" name="noteTitle">
            </header>
            <textarea class="textfield noteCardInput" placeholder="Content" name="noteTitle"></textarea>
            <br>
            <footer>
                <a class="button primary">Submit</a>
                <a onclick="clearDraftedNote();" class="button">Clear Contents</a>
            </footer>
        </div>
    </div>
</div>