export const HIT_BASE_SCORE = 100;
export const MAX_HIT_SCORE = 500;
export const STREAK_SCORE = 20;

export const BEST_STREAK_BONUS = 10;
export const ACCURACY_BONUS = 500;
export const SPEED_BONUS = 10;

export class ScoreManager {
    static currNoteScore = 0;

    static attemptCount = 0;
    static hitCount = 0;
    static mistakeCount = 0;

    static streak = 0;
    static bestStreak = 0;

    static totalNoteScore = 0;

    static push(value: "success" | "mistake") {
        this.attemptCount++;

        switch (value) {
            case "success":
                this.currNoteScore = Math.min(MAX_HIT_SCORE, HIT_BASE_SCORE + this.streak * STREAK_SCORE);
                this.hitCount++;
                this.streak++;
                this.bestStreak = Math.max(this.streak, this.bestStreak);
                this.totalNoteScore += this.currNoteScore;
                break;
            case "mistake":
                this.currNoteScore = 0;
                this.mistakeCount++;
                this.streak = 0;
                break;
        }
        console.log("<ScoreManager> push", this.getScore());
        return this.getScore();
    }

    static getScore() {
        const score = {
            currNoteScore: this.currNoteScore,
            attemptCount: this.attemptCount,
            hitCount: this.hitCount,
            mistakeCount: this.mistakeCount,
            streak: this.streak,
            bestStreak: this.bestStreak,
            totalNoteScore: this.totalNoteScore,
        };
        // console.log(score);
        return score;
    }

    static getAccuracy() {
        return this.hitCount / this.attemptCount;
    }

    static getFinalScore(levelDurationInSeconds: number) {
        const bestStreakBonus = this.bestStreak * BEST_STREAK_BONUS;

        const accuracyBonus = ACCURACY_BONUS * this.getAccuracy();

        const hitsPerMinute = this.hitCount * (60 / levelDurationInSeconds);

        const speedBonus = SPEED_BONUS * hitsPerMinute;

        return {
            bestStreakBonus,
            accuracyBonus,
            speedBonus,
            totalScore: this.totalNoteScore + bestStreakBonus + accuracyBonus + speedBonus,
        };
        // this.noteScore + bestStreakBonus + accuracyBonus;
    }

    static reset() {
        this.currNoteScore = 0;
        this.attemptCount = 0;
        this.hitCount = 0;
        this.mistakeCount = 0;
        this.streak = 0;
        this.bestStreak = 0;
        this.totalNoteScore = 0;

        console.log("<ScoreManager> reset");
    }
}
