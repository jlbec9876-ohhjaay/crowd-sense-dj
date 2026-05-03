export function generateReportCard(stats) {
    const {
        avgScore,
        maxCombo,
        avgCrowdEnergy,
        bpmConsistency,
    } = stats;

    //Normalize Values
    const comboScore = Math.min(maxCombo / 10, 1);  //cap at 1
    const energyScore = avgCrowdEnergy / 100;

    //Weighted Total
    let total = avgScore * 0.4 + (maxCombo / 10) * 0.2 + (avgCrowdEnergy / 100) * 0.2 + bpmConsistency * 0.2;

    //Clamp to 0-1
    total = Math.max(0, Math.min(1, total));

    //Grade
    let grade = "F";

    if (total > 0.9) grade = 'A';
    else if (total > 0.75) grade = 'B';
    else if (total > 0.6) grade = 'C';
    else if (total > 0.45) grade = 'D';

    //Dynamic summary
    let summaryParts = [];

    if (avgScore > 0.8) {
        summaryParts.push("Excellent transitions");
    } else if (avgScore < 0.5) {
        summaryParts.push("Transitions need some work")
    }

    if (maxCombo > 5) {
        summaryParts.push("Great momentum building");
        } else if (maxCombo === 0) {
            summaryParts.push("Couldn't maintain combos");
        }

        if (avgCrowdEnergy > 70) {
            summaryParts.push("Crowd stayed highly engaged");
        } else if (avgCrowdEnergy < 40) {
            summaryParts.push("Crowd energy dropped too often");
        }

        if (bpmConsistency > 0.8) {
            summaryParts.push("Tight Beatmatching");
        } else if (bpmConsistency < 0.5) {
            summaryParts.push("Unstable timing");
        }

        const summary = summaryParts.length > 0 ? summaryParts.join(". ") + "." : "Balanced performace.";

    return {
        grade, 
        score,
        summary,
        breakdown: {
            transitions: avgScore,
            combo: comboScore,
            energy: energyScore,
            timing: bpmConsistency
        }
    };
}