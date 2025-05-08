export const HIT_BASE_SCORE = 100;
export const MAX_HIT_SCORE = 500;
export const STREAK_SCORE = 20;

export const BEST_STREAK_BONUS = 50;
export const ACCURACY_BONUS = 1000;
export const PERFECT_ACCURACY_BONUS = 1000;
export const SPEED_BONUS = 25;

export class ScoreManager {
    static currNoteValue = 0;
    static currStreak = 0;

    static attempts = 0;
    static successes = 0;
    static mistakes = 0;

    static bestStreak = 0;
    static totalNoteScore = 0;

    static push(value: "success" | "mistake") {
        this.attempts++;

        switch (value) {
            case "success":
                this.currNoteValue = Math.min(MAX_HIT_SCORE, HIT_BASE_SCORE + this.currStreak * STREAK_SCORE);
                this.successes++;
                this.currStreak++;
                this.bestStreak = Math.max(this.currStreak, this.bestStreak);
                this.totalNoteScore += this.currNoteValue;
                break;
            case "mistake":
                this.currNoteValue = 0;
                this.mistakes++;
                this.currStreak = 0;
                break;
        }
        // console.log("<ScoreManager> push", this.getScore());
        return this.getScore();
    }

    static getScore() {
        const score = {
            currNoteValue: this.currNoteValue,
            attempts: this.attempts,
            successes: this.successes,
            mistakes: this.mistakes,
            currStreak: this.currStreak,
            bestStreak: this.bestStreak,
            totalNoteScore: this.totalNoteScore,
            accuracy: this.getAccuracy(),
        };
        // console.log(score);
        return score;
    }

    static getAccuracy() {
        const acc = this.successes / this.attempts;
        if (Number.isNaN(acc)) return 0;
        return acc;
    }

    static getFinalScore(levelDurationInSeconds: number) {
        const bestStreakBonus = this.bestStreak * BEST_STREAK_BONUS;

        const accuracyBonus = Math.round(ACCURACY_BONUS * this.getAccuracy());
        const perfectAccuracyBonus = this.getAccuracy() === 1 ? PERFECT_ACCURACY_BONUS : 0;

        const hitsPerMinute = this.successes * (60 / levelDurationInSeconds);
        const speedBonus = Math.round(SPEED_BONUS * hitsPerMinute);

        const totalScore = this.totalNoteScore + bestStreakBonus + speedBonus + accuracyBonus + perfectAccuracyBonus;
        return {
            bestStreakBonus,
            accuracyBonus,
            perfectAccuracyBonus,
            speedBonus,
            hitsPerMinute,
            totalScore,
        };
        // this.noteScore + bestStreakBonus + accuracyBonus;
    }

    static reset() {
        this.currNoteValue = 0;
        this.attempts = 0;
        this.successes = 0;
        this.mistakes = 0;
        this.currStreak = 0;
        this.bestStreak = 0;
        this.totalNoteScore = 0;
        // console.log("<ScoreManager> reset");
    }
}
