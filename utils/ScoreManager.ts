const HIT_BASE_SCORE = 100;
const STREAK_BONUS_SCORE = 10;
const MAX_SCORE = 500;

export class ScoreManager {
    static streak = 0;

    static push(value: "success" | "mistake") {
        let noteScore = 0;
        switch (value) {
            case "success":
                noteScore = Math.min(MAX_SCORE, HIT_BASE_SCORE + this.streak * STREAK_BONUS_SCORE);
                this.streak++;
                break;
            case "mistake":
                this.streak = 0;
                break;
        }
        console.log("<ScoreManager> push", { noteScore, streak: this.streak });
        return noteScore;
    }

    static reset() {
        this.streak = 0;
        console.log("<ScoreManager> reset", { streak: this.streak });
    }
}
