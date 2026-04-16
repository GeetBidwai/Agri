from .models import UserProfile


def get_or_create_profile(user):
    return UserProfile.objects.get_or_create(user=user)


def is_seller(user):
    if not user or not user.is_authenticated:
        return False

    profile, _ = get_or_create_profile(user)
    return profile.role == "seller"
