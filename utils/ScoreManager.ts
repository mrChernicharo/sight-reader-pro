const HIT_BASE_SCORE = 100;
const STREAK_BONUS_SCORE = 10;
const MAX_SCORE = 500;

export class ScoreManager {
    static streak = 0;
    static bestStreak = 0;
    static currScore = 0;
    static hitCount = 0;

    static push(value: "success" | "mistake") {
        let noteScore = 0;
        switch (value) {
            case "success":
                noteScore = Math.min(MAX_SCORE, HIT_BASE_SCORE + this.streak * STREAK_BONUS_SCORE);
                this.streak++;
                this.hitCount++;
                this.bestStreak = Math.max(this.streak, this.bestStreak);
                break;
            case "mistake":
                this.streak = 0;
                break;
        }
        console.log("<ScoreManager> push", { noteScore, streak: this.streak });
        this.currScore += noteScore;
        return noteScore;
    }

    static reset() {
        this.streak = 0;
        this.currScore = 0;
        this.hitCount = 0;
        this.bestStreak = 0;
        console.log("<ScoreManager> reset");
    }

    static getScore() {
        const score = {
            value: this.currScore,
            multiplier: 1,
            hits: this.hitCount,
            hitScore: HIT_BASE_SCORE,
            bestStreak: this.bestStreak,
        };
        console.log(score);
        return score;
    }
}
