from .models import UserProfile


def get_or_create_profile(user):
    return UserProfile.objects.get_or_create(user=user)


def has_verified_account(user):
    if not user or not user.is_authenticated:
        return False

    profile, _ = get_or_create_profile(user)
    return bool(profile.is_verified)
