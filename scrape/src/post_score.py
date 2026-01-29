import math
from datetime import datetime

def calculate_hot_score(score: int, created_utc: datetime) -> float:
    """
    Calculate Reddit's 'hot' score algorithm.
    """
    order = math.log10(max(abs(score), 1))
    
    if score > 0:
        sign = 1
    elif score < 0:
        sign = -1
    else:
        sign = 0
    
    # Reddit's epoch (December 8, 2005)
    epoch = datetime(2005, 12, 8, 7, 46, 43)
    
    seconds = (created_utc - epoch).total_seconds()
    
    return round(sign * order + seconds / 45000, 7)


def calculate_controversial_score(score: int, upvote_ratio: float) -> float:
    """
    Calculate Reddit's 'controversial' score.
    Posts with ratios close to 0.5 are most controversial.
    High absolute scores make them more controversial.
    """
    if upvote_ratio is None or upvote_ratio == 0:
        return 0.0
    
    balance = 1 - abs(upvote_ratio - 0.5) * 2
    
    if upvote_ratio > 0:
        ups = score / (2 * upvote_ratio - 1) if upvote_ratio != 0.5 else score
        magnitude = math.log10(max(abs(ups), 1))
    else:
        magnitude = 0
    
    return round(balance * magnitude, 7)
