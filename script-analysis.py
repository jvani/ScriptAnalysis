import re
import pandas as pd
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

class Script(object):
    def __init__(self, script):
        """Container for analyzing scripts."""
        self.script = script
        self.dialogue = self.parse_dialogue(self.script)


    def parse_dialogue(self, script, vader=True):
        """Parse character dialogue from a standard format script (e.g., 6 tabs to
        character name, 5 tabs to stage dirs, and 4 tabs to dialogue).
        Args:
            script (str) - path to script .txt file.
        Returns:
            dialogue (df) - dataframe of .
        """

        with open(script) as f:
            # -- Variables.
            dialogue = []
            character = None
            lines = ""
            regex = r"(?<=\. ) | (?<=\? ) | (?<=\! )"
            # -- Iterate over all lines in script.
            for idx, line in enumerate(f):
                # -- Character name.
                if line.startswith("\t\t\t\t\t\t"):
                    if len(lines) > 0: # -- Append data where there is dialogue.
                        sentences = re.split(regex, lines)
                        for sentence in sentences:
                            dialogue.append([character, sentence])
                        lines = "" # -- Reset lines for next character.
                    character  = line.lstrip("\t\t\t\t\t\t").rstrip("\n")
                # -- Pass stage directions.
                elif line.startswith("\t\t\t\t\t"):
                    pass
                # -- Dialogue.
                elif line.startswith("\t\t\t\t"):
                    ll = line.lstrip("\t\t\t\t").rstrip("\n")
                    lines = lines + ll
                # -- Pass other info.
                else:
                    pass

        self.dialogue = pd.DataFrame(dialogue, columns=["Character", "Line"])

        if vader:
            self.vader_sentiment()

        return self.dialogue


    def vader_sentiment(self):
        """Use vader sentiment intensity analyzer for every parsed line and
        append scores to dialogue dataframe."""

        analyzer = SentimentIntensityAnalyzer()
        sentiment = []
        for sentence in self.dialogue.Line:
            sentiment.append(analyzer.polarity_scores(sentence))

        self.dialogue["compound"] = [ii["compound"] for ii in sentiment]
        self.dialogue["neg"] = [ii["neg"] for ii in sentiment]
        self.dialogue["neu"] = [ii["neu"] for ii in sentiment]
        self.dialogue["pos"] = [ii["pos"] for ii in sentiment]
